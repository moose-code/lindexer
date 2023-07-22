let queryEventsWithCombinedFilterAndProcessEventBatch = async (
  ~addressInterfaceMapping,
  ~eventFilters,
  ~fromBlock,
  ~toBlock,
  ~blockLoader,
  ~provider,
  ~chainConfig: Config.chainConfig,
  ~logger: Pino.t,
) => {
  let events = await EventFetching.queryEventsWithCombinedFilter(
    ~addressInterfaceMapping,
    ~eventFilters,
    ~fromBlock,
    ~toBlock,
    ~blockLoader,
    ~provider,
    ~chainId=chainConfig.chainId,
    ~logger,
    (),
  )
  events->EventProcessing.processEventBatch(
    ~chainConfig,
    ~blockLoader,
    ~blocksProcessed={from: fromBlock, to: toBlock},
    ~logger,
  )
}

let processAllEventsFromBlockNumber = async (
  ~fromBlock: int,
  ~chainConfig: Config.chainConfig,
  ~blockLoader,
  ~logger,
) => {
  let sc = chainConfig.syncConfig
  let addressInterfaceMapping: Js.Dict.t<Ethers.Interface.t> = Js.Dict.empty()
  let provider = chainConfig.provider

  let eventFilters = EventFetching.getAllEventFilters(
    ~addressInterfaceMapping,
    ~chainConfig,
    ~provider,
  )

  let fromBlockRef = ref(fromBlock)

  let getCurrentBlockFromRPC = () =>
    provider
    ->Ethers.JsonRpcProvider.getBlockNumber
    ->Promise.catch(_err => {
      logger->Logging.childWarn("Error getting current block number")
      0->Promise.resolve
    })
  let currentBlock: ref<int> = ref(await getCurrentBlockFromRPC())

  //we retrieve the latest processed block from the db and add 1
  //if only one block has occurred since that processed block we ensure that the new block
  //is handled with the below condition
  let shouldContinueProcess = () => fromBlockRef.contents <= currentBlock.contents

  let currentBlockInterval = ref(sc.initialBlockInterval)

  while shouldContinueProcess() {
    let blockInterval = currentBlockInterval.contents
    let targetBlock = Pervasives.min(
      currentBlock.contents,
      fromBlockRef.contents + blockInterval - 1,
    )

    let (
      events,
      blocksProcessed,
      finalBlockInterval,
    ) = await EventFetching.getContractEventsOnFilters(
      ~eventFilters,
      ~addressInterfaceMapping,
      ~fromBlock=fromBlockRef.contents,
      ~toBlock=targetBlock,
      ~initialBlockInterval=blockInterval,
      ~minFromBlockLogIndex=0,
      ~chainConfig,
      ~blockLoader,
      ~logger,
      (),
    )

    //process the batch of events
    //NOTE: we can use this to track batch processing time
    await events->EventProcessing.processEventBatch(
      ~chainConfig,
      ~blockLoader,
      ~blocksProcessed,
      ~logger,
    )

    fromBlockRef := blocksProcessed.to + 1

    // Increase batch size going forward, but do not increase past a configured maximum
    // See: https://en.wikipedia.org/wiki/Additive_increase/multiplicative_decrease
    currentBlockInterval :=
      Pervasives.min(finalBlockInterval + sc.accelerationAdditive, sc.intervalCeiling)

    // Only fetch the current block if it could affect the length of our next batch
    let nextIntervalEnd = fromBlockRef.contents + currentBlockInterval.contents - 1
    if currentBlock.contents <= nextIntervalEnd {
      Logging.info(
        `We will finish processing known blocks in the next block. Checking for a newer block than ${currentBlock.contents->Belt.Int.toString}`,
      )
      currentBlock := (await getCurrentBlockFromRPC())
      Logging.info(`getCurrentBlockFromRPC() => ${currentBlock.contents->Belt.Int.toString}`)
    }
  }
}

let processAllEvents = async (chainConfig: Config.chainConfig) => {
  let traceLogger = Logging.createChild(~params={"chainId": chainConfig.chainId})

  let blockLoader = LazyLoader.make(
    ~loaderFn=EventFetching.getUnwrappedBlock(chainConfig.provider),
    (),
  )
  let latestProcessedBlock = await DbFunctions.RawEvents.getLatestProcessedBlockNumber(
    ~chainId=chainConfig.chainId,
  )

  let startBlock =
    latestProcessedBlock->Belt.Option.mapWithDefault(chainConfig.startBlock, latestProcessedBlock =>
      latestProcessedBlock + 1
    )
  traceLogger->Logging.childTrace({
    "msg": "Starting processing events for chain.",
    "startBlock": startBlock,
    "latestProcessedBlock": latestProcessedBlock,
  })

  //Add all contracts and addresses from config
  Converters.ContractNameAddressMappings.registerStaticAddresses(~chainConfig, ~logger=traceLogger)

  //Add all dynamic contracts from DB
  let dynamicContracts =
    await DbFunctions.sql->DbFunctions.DynamicContractRegistry.readDynamicContractsOnChainIdAtOrBeforeBlock(
      ~chainId=chainConfig.chainId,
      ~startBlock,
    )

  dynamicContracts->Belt.Array.forEach(({contractType, contractAddress}) =>
    Converters.ContractNameAddressMappings.addContractAddress(
      ~chainId=chainConfig.chainId,
      ~contractName=contractType,
      ~contractAddress,
    )
  )

  await processAllEventsFromBlockNumber(
    ~fromBlock=startBlock,
    ~chainConfig,
    ~blockLoader,
    ~logger=traceLogger,
  )
}

let startSyncingAllEvents = () => {
  Logging.trace("Starting syncing all events")
  Config.config
  ->Js.Dict.values
  ->Belt.Array.map(chainConfig => {
    chainConfig->processAllEvents
  })
  ->Promise.all
  ->Promise.thenResolve(_ => ())
}
