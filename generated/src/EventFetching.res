exception QueryTimout(string)

type blocksProcessed = {
  from: int,
  to: int,
}

let getUnwrappedBlock = (provider, blockNumber) =>
  provider
  ->Ethers.JsonRpcProvider.getBlock(blockNumber)
  ->Promise.then(blockNullable =>
    switch blockNullable->Js.Nullable.toOption {
    | Some(block) => Promise.resolve(block)
    | None =>
      Promise.reject(
        Js.Exn.raiseError(`RPC returned null for blockNumber ${blockNumber->Belt.Int.toString}`),
      )
    }
  )

let getSingleContractEventFilters = (
  ~contractAddress,
  ~chainConfig: Config.chainConfig,
  ~addressInterfaceMapping,
) => {
  let contractName = Converters.ContractNameAddressMappings.getContractNameFromAddress(
    ~chainId=chainConfig.chainId,
    ~contractAddress,
  )
  let contractConfig = switch chainConfig.contracts->Js.Array2.find(contract =>
    contract.name == contractName
  ) {
  | None => Converters.UndefinedContractName(contractName, chainConfig.chainId)->raise
  | Some(contractConfig) => contractConfig
  }

  let contractEthers = Ethers.Contract.make(
    ~address=contractAddress,
    ~abi=contractConfig.abi,
    ~provider=chainConfig.provider,
  )

  addressInterfaceMapping->Js.Dict.set(
    contractAddress->Ethers.ethAddressToString,
    contractEthers->Ethers.Contract.getInterface,
  )

  contractConfig.events->Belt.Array.map(eventName => {
    contractEthers->Ethers.Contract.getEventFilter(~eventName=Types.eventNameToString(eventName))
  })
}

let getAllEventFilters = (
  ~addressInterfaceMapping,
  ~chainConfig: Config.chainConfig,
  ~provider,
) => {
  let eventFilters = []

  chainConfig.contracts->Belt.Array.forEach(contract => {
    Converters.ContractNameAddressMappings.getAddressesFromContractName(
      ~chainId=chainConfig.chainId,
      ~contractName=contract.name,
    )->Belt.Array.forEach(address => {
      let contractEthers = Ethers.Contract.make(~address, ~abi=contract.abi, ~provider)
      addressInterfaceMapping->Js.Dict.set(
        address->Ethers.ethAddressToString,
        contractEthers->Ethers.Contract.getInterface,
      )

      contract.events->Belt.Array.forEach(
        eventName => {
          let eventFilter =
            contractEthers->Ethers.Contract.getEventFilter(
              ~eventName=Types.eventNameToString(eventName),
            )
          let _ = eventFilters->Js.Array2.push(eventFilter)
        },
      )
    })
  })
  eventFilters
}

let makeCombinedEventFilterQuery = (
  ~provider,
  ~eventFilters,
  ~fromBlock,
  ~toBlock,
  ~logger: Pino.t,
) => {
  open Ethers.BlockTag

  let combinedFilter =
    eventFilters->Ethers.CombinedFilter.combineEventFilters(
      ~fromBlock=BlockNumber(fromBlock)->blockTagFromVariant,
      ~toBlock=BlockNumber(toBlock)->blockTagFromVariant,
    )

  let numBlocks = toBlock - fromBlock + 1

  logger->Logging.childTrace({
    "msg": "Initiating Combined Query Filter",
    "from": fromBlock,
    "to": toBlock,
    "numBlocks": numBlocks,
  })

  provider
  ->Ethers.JsonRpcProvider.getLogs(
    ~filter={combinedFilter->Ethers.CombinedFilter.combinedFilterToFilter},
  )
  ->Promise.thenResolve(res => {
    logger->Logging.childTrace({
      "msg": "Successful Combined Query Filter",
      "from": fromBlock,
      "to": toBlock,
      "numBlocks": numBlocks,
    })
    res
  })
  ->Promise.catch(err => {
    logger->Logging.childWarn({
      "msg": "Failed Combined Query Filter from block",
      "from": fromBlock,
      "to": toBlock,
      "numBlocks": numBlocks,
    })
    err->Promise.reject
  })
}

type eventBatchPromise = {
  blockNumber: int,
  logIndex: int,
  eventPromise: promise<Types.event>,
}

let convertLogs = (
  logs: array<Ethers.log>,
  ~blockLoader,
  ~addressInterfaceMapping,
  ~chainId,
  ~logger,
) => {
  logger->Logging.childTrace({
    "msg": "Handling of logs",
    "numberLogs": logs->Belt.Array.length,
  })

  logs
  ->Belt.Array.map(log => {
    let blockPromise = blockLoader->LazyLoader.get(log.blockNumber)

    //get a specific interface type
    //interface type parses the log
    let optInterface = addressInterfaceMapping->Js.Dict.get(log.address->Obj.magic)

    switch optInterface {
    | None => None
    | Some(interface) =>
      Some({
        blockNumber: log.blockNumber,
        logIndex: log.logIndex,
        eventPromise: {
          let logDescription = interface->Ethers.Interface.parseLog(~log)

          switch Converters.eventStringToEvent(
            logDescription.name,
            Converters.ContractNameAddressMappings.getContractNameFromAddress(
              ~contractAddress=log.address,
              ~chainId,
            ),
          ) {
          | ERC721Contract_TransferEvent =>
            let convertedEvent =
              logDescription
              ->Converters.ERC721.convertTransferLogDescription
              ->Converters.ERC721.convertTransferLog(~log, ~blockPromise)

            convertedEvent
          }
        },
      })
    }
  })
  ->Belt.Array.keepMap(opt => opt)
}

let applyConditionalFunction = (value: 'a, condition: bool, callback: 'a => 'b) => {
  condition ? callback(value) : value
}

let queryEventsWithCombinedFilter = async (
  ~addressInterfaceMapping,
  ~eventFilters,
  ~fromBlock,
  ~toBlock,
  ~minFromBlockLogIndex=0,
  ~blockLoader,
  ~provider,
  ~chainId,
  ~logger: Pino.t,
  (),
): array<eventBatchPromise> => {
  let combinedFilterRes = await makeCombinedEventFilterQuery(
    ~provider,
    ~eventFilters,
    ~fromBlock,
    ~toBlock,
    ~logger,
  )

  let logs = combinedFilterRes->applyConditionalFunction(minFromBlockLogIndex > 0, arrLogs => {
    arrLogs->Belt.Array.keep(log => {
      log.blockNumber > fromBlock ||
        (log.blockNumber == fromBlock && log.logIndex >= minFromBlockLogIndex)
    })
  })

  logs->convertLogs(~blockLoader, ~addressInterfaceMapping, ~chainId, ~logger)
}
let getContractEventsOnFilters = async (
  ~eventFilters,
  ~addressInterfaceMapping,
  ~fromBlock,
  ~toBlock,
  ~initialBlockInterval,
  ~minFromBlockLogIndex=0,
  ~chainConfig: Config.chainConfig,
  ~blockLoader,
  ~logger,
  (),
) => {
  let sc = chainConfig.syncConfig

  let fromBlockRef = ref(fromBlock)
  let shouldContinueProcess = () => fromBlockRef.contents <= toBlock

  let currentBlockInterval = ref(initialBlockInterval)
  let events = ref([])
  while shouldContinueProcess() {
    logger->Logging.childTrace("continuing to process...")
    let rec executeQuery = (~blockInterval): Promise.t<(array<eventBatchPromise>, int)> => {
      //If the query hangs for longer than this, reject this promise to reduce the block interval
      let queryTimoutPromise =
        Time.resolvePromiseAfterDelay(~delayMilliseconds=sc.queryTimeoutMillis)->Promise.then(() =>
          Promise.reject(
            QueryTimout(
              `Query took longer than ${Belt.Int.toString(sc.queryTimeoutMillis / 1000)} seconds`,
            ),
          )
        )

      let upperBoundToBlock = fromBlockRef.contents + blockInterval - 1
      let nextToBlock = Pervasives.min(upperBoundToBlock, toBlock)
      let eventsPromise =
        queryEventsWithCombinedFilter(
          ~addressInterfaceMapping,
          ~eventFilters,
          ~fromBlock=fromBlockRef.contents,
          ~toBlock=nextToBlock,
          ~minFromBlockLogIndex=fromBlockRef.contents == fromBlock ? minFromBlockLogIndex : 0,
          ~provider=chainConfig.provider,
          ~blockLoader,
          ~chainId=chainConfig.chainId,
          ~logger,
          (),
        )->Promise.thenResolve(events => (events, nextToBlock - fromBlockRef.contents + 1))

      [queryTimoutPromise, eventsPromise]
      ->Promise.race
      ->Promise.catch(err => {
        logger->Logging.childWarn({
          "msg": "Error getting events, will retry after backoff time",
          "backOffMilliseconds": sc.backoffMillis,
          "err": err,
        })

        Time.resolvePromiseAfterDelay(~delayMilliseconds=sc.backoffMillis)->Promise.then(_ => {
          let nextBlockIntervalTry =
            (blockInterval->Belt.Int.toFloat *. sc.backoffMultiplicative)->Belt.Int.fromFloat
          logger->Logging.childTrace({
            "msg": "Retrying query fromBlock and toBlock",
            "fromBlock": fromBlock,
            "toBlock": nextBlockIntervalTry,
          })

          executeQuery(~blockInterval={nextBlockIntervalTry})
        })
      })
    }

    let (intervalEvents, executedBlockInterval) = await executeQuery(
      ~blockInterval=currentBlockInterval.contents,
    )
    events := events.contents->Belt.Array.concat(intervalEvents)

    // Increase batch size going forward, but do not increase past a configured maximum
    // See: https://en.wikipedia.org/wiki/Additive_increase/multiplicative_decrease
    currentBlockInterval :=
      Pervasives.min(executedBlockInterval + sc.accelerationAdditive, sc.intervalCeiling)

    fromBlockRef := fromBlockRef.contents + executedBlockInterval
    logger->Logging.childTrace({
      "msg": "Queried processAllEventsFromBlockNumber ",
      "lastBlockProcessed": fromBlockRef.contents - 1,
      "toBlock": toBlock,
      "numEvents": intervalEvents->Array.length,
    })
  }
  (events.contents, {from: fromBlock, to: fromBlockRef.contents - 1}, currentBlockInterval.contents)
}
