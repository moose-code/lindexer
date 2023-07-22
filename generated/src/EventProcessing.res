let addEventToRawEvents = (
  event: Types.eventLog<'a>,
  ~chainId,
  ~jsonSerializedParams: Js.Json.t,
  ~eventName: Types.eventName,
) => {
  let {
    blockNumber,
    logIndex,
    transactionIndex,
    transactionHash,
    srcAddress,
    blockHash,
    blockTimestamp,
  } = event

  let eventId = EventUtils.packEventIndex(~logIndex, ~blockNumber)
  let rawEvent: Types.rawEventsEntity = {
    chainId,
    eventId: eventId->Ethers.BigInt.toString,
    blockNumber,
    logIndex,
    transactionIndex,
    transactionHash,
    srcAddress,
    blockHash,
    blockTimestamp,
    eventType: eventName->Types.eventName_encode,
    params: jsonSerializedParams->Js.Json.stringify,
  }

  IO.InMemoryStore.RawEvents.setRawEvents(~entity=rawEvent)
}
let eventRouter = (event: Types.eventAndContext, ~chainId) => {
  switch event {
  | ERC721Contract_TransferWithContext(event, context) => {
      let jsonSerializedParams = event.params->Types.ERC721Contract.TransferEvent.eventArgs_encode
      event->addEventToRawEvents(
        ~chainId,
        ~jsonSerializedParams,
        ~eventName=ERC721Contract_TransferEvent,
      )

      let handler = Handlers.ERC721Contract.Transfer.getHandler()

      try {
        handler(~event, ~context)
      } catch {
      // NOTE: we are only catching javascript errors here - please see docs on how to catch rescript errors too: https://rescript-lang.org/docs/manual/latest/exception
      | userCodeException =>
        // TODO: we must add the network details of this event too!
        let eventInfoString = `The details of the event that caused this issue:
eventName: ERC721.Transfer
txHash: ${event.transactionHash}
blockNumber: ${event.blockNumber->Belt.Int.toString}
logIndex: ${event.logIndex->Belt.Int.toString}
transactionIndex: ${event.transactionIndex->Belt.Int.toString}`
        let errorMessage = switch userCodeException {
        | Js.Exn.Error(obj) =>
          switch Js.Exn.message(obj) {
          | Some(m) =>
            Some(
              `Caught a JS exception in your ERC721Contract.Transfer.handler with this message: ${m}.

Please fix this error to keep the indexer running smoothly.

${eventInfoString}
`,
            )
          | None => None
          }
        | _ => None
        }->Belt.Option.getWithDefault(
          `Unknown error in your ERC721Contract.Transfer.handler, please review your code carefully and use the stack trace to help you find the issue.

${eventInfoString}`,
        )
        context.log.errorWithExn(userCodeException, errorMessage)
      }
    }
  }
}

type readEntitiesResult = {
  blockNumber: int,
  logIndex: int,
  entityReads: array<Types.entityRead>,
  eventAndContext: Types.eventAndContext,
}

type rec readEntitiesResultPromise = {
  blockNumber: int,
  logIndex: int,
  promise: promise<(
    array<Types.entityRead>,
    Types.eventAndContext,
    option<array<readEntitiesResultPromise>>,
  )>,
}

let rec loadReadEntitiesInner = async (
  eventBatch: array<EventFetching.eventBatchPromise>,
  ~chainConfig: Config.chainConfig,
  ~blocksProcessed: EventFetching.blocksProcessed,
  ~blockLoader,
  ~logger,
): array<readEntitiesResultPromise> => {
  // Recursively load entities
  let loadNestedReadEntities = async (
    ~blockNumber,
    ~logIndex,
    ~dynamicContracts: array<Types.dynamicContractRegistryEntity>,
  ): array<readEntitiesResultPromise> => {
    let addressInterfaceMapping = Js.Dict.empty()

    let eventFilters = dynamicContracts->Belt.Array.flatMap(contract => {
      EventFetching.getSingleContractEventFilters(
        ~contractAddress=contract.contractAddress,
        ~chainConfig,
        ~addressInterfaceMapping,
      )
    })

    let (fetchedEvents, nestedBlocksProcessed, _) = await EventFetching.getContractEventsOnFilters(
      ~eventFilters,
      ~addressInterfaceMapping,
      ~fromBlock=blockNumber,
      ~toBlock=blocksProcessed.to,
      ~minFromBlockLogIndex=logIndex + 1,
      ~initialBlockInterval=blocksProcessed.to - blockNumber + 1,
      ~chainConfig,
      ~blockLoader,
      ~logger,
      (),
    )

    await fetchedEvents->loadReadEntitiesInner(
      ~chainConfig,
      ~blockLoader,
      ~blocksProcessed=nestedBlocksProcessed,
      ~logger,
    )
  }

  let baseResults: array<readEntitiesResultPromise> = []

  let chainId = chainConfig.chainId

  for i in 0 to eventBatch->Belt.Array.length - 1 {
    let {blockNumber, logIndex, eventPromise} = eventBatch[i]
    baseResults
    ->Js.Array2.push({
      blockNumber,
      logIndex,
      promise: eventPromise->Promise.then(async event =>
        switch event {
        | ERC721Contract_Transfer(event) => {
            let contextHelper = Context.ERC721Contract.TransferEvent.contextCreator(
              ~chainId,
              ~event,
              ~logger,
            )

            let context = contextHelper.getLoaderContext()

            let loader = Handlers.ERC721Contract.Transfer.getLoader()

            try {
              loader(~event, ~context)
            } catch {
            // NOTE: we are only catching javascript errors here - please see docs on how to catch rescript errors too: https://rescript-lang.org/docs/manual/latest/exception
            | userCodeException =>
              // TODO: we must add the network details of this event too!
              let eventInfoString = `The details of the event that caused this issue:
eventName: ERC721.Transfer
txHash: ${event.transactionHash}
blockNumber: ${event.blockNumber->Belt.Int.toString}
logIndex: ${event.logIndex->Belt.Int.toString}
transactionIndex: ${event.transactionIndex->Belt.Int.toString}`
              let errorMessage = switch userCodeException {
              | Js.Exn.Error(obj) =>
                switch Js.Exn.message(obj) {
                | Some(m) =>
                  Some(
                    `Caught a JS exception in your ERC721Contract.Transfer.loader with this message: ${m}.

Please fix this error to keep the indexer running smoothly.

${eventInfoString}
`,
                  )
                | None => None
                }
              | _ => None
              }->Belt.Option.getWithDefault(
                `Unknown error in your ERC721Contract.Transfer.loader, please review your code carefully and use the stack trace to help you find the issue.

${eventInfoString}`,
              )
              // NOTE: we could use the user `uerror` function instead rather than using a system error. This is debatable.
              logger->Logging.childErrorWithExn(userCodeException, errorMessage)
            }

            let {logIndex, blockNumber} = event
            let eventId = EventUtils.packEventIndex(~logIndex, ~blockNumber)
            let context = contextHelper.getContext(
              ~eventData={chainId, eventId: eventId->Ethers.BigInt.toString},
            )

            let dynamicContracts = contextHelper.getAddedDynamicContractRegistrations()

            (
              contextHelper.getEntitiesToLoad(),
              Types.ERC721Contract_TransferWithContext(event, context),
              if Belt.Array.length(dynamicContracts) > 0 {
                Some(await loadNestedReadEntities(~blockNumber, ~logIndex, ~dynamicContracts))
              } else {
                None
              },
            )
          }
        }
      ),
    })
    ->ignore
  }

  baseResults
}

type rec nestedResult = {
  result: readEntitiesResult,
  nested: option<array<nestedResult>>,
}
// Given a read entities promise, unwrap just the top level result
let unwrap = async (p: readEntitiesResultPromise): readEntitiesResult => {
  let (er, ec, _) = await p.promise
  {
    blockNumber: p.blockNumber,
    logIndex: p.logIndex,
    entityReads: er,
    eventAndContext: ec,
  }
}

// Recursively await the promises to get their results
let rec recurseEntityPromises = async (p: readEntitiesResultPromise): nestedResult => {
  let (_, _, nested) = await p.promise

  {
    result: await unwrap(p),
    nested: switch nested {
    | None => None
    | Some(xs) => Some(await xs->Belt.Array.map(recurseEntityPromises)->Promise.all)
    },
  }
}

// This function is used to sort results according to their order in the chain
let resultPosition = ({blockNumber, logIndex}: readEntitiesResult) => (blockNumber, logIndex)

// Given the recursively awaited results, flatten them down into a single list using chain order
let rec flattenNested = (xs: array<nestedResult>): array<readEntitiesResult> => {
  let baseResults = xs->Belt.Array.map(({result}) => result)
  let nestedNestedResults = xs->Belt.Array.keepMap(({nested}) => nested)
  let nestedResults = nestedNestedResults->Belt.Array.map(flattenNested)
  Belt.Array.reduce(nestedResults, baseResults, (acc, additionalResults) =>
    Utils.mergeSorted(resultPosition, acc, additionalResults)
  )
}

let loadReadEntities = async (
  eventBatch: array<EventFetching.eventBatchPromise>,
  ~chainConfig: Config.chainConfig,
  ~blockLoader,
  ~blocksProcessed: EventFetching.blocksProcessed,
  ~logger: Pino.t,
): array<Types.eventAndContext> => {
  let batch =
    await eventBatch->loadReadEntitiesInner(~chainConfig, ~blocksProcessed, ~blockLoader, ~logger)

  let nestedResults = await batch->Belt.Array.map(recurseEntityPromises)->Promise.all
  let mergedResults = flattenNested(nestedResults)

  // Project the result record into a tuple, so that we can unzip the two payloads.
  let resultToPair = ({entityReads, eventAndContext}) => (entityReads, eventAndContext)

  let (readEntitiesGrouped, contexts): (
    array<array<Types.entityRead>>,
    array<Types.eventAndContext>,
  ) =
    mergedResults->Belt.Array.map(resultToPair)->Belt.Array.unzip

  let readEntities = readEntitiesGrouped->Belt.Array.concatMany

  await DbFunctions.sql->IO.loadEntities(readEntities)

  contexts
}

let processEventBatch = async (
  eventBatch: array<EventFetching.eventBatchPromise>,
  ~chainConfig,
  ~blocksProcessed: EventFetching.blocksProcessed,
  ~blockLoader,
  ~logger: Pino.t,
) => {
  IO.InMemoryStore.resetStore()

  let eventBatchAndContext =
    await eventBatch->loadReadEntities(~chainConfig, ~blockLoader, ~blocksProcessed, ~logger)

  eventBatchAndContext->Belt.Array.forEach(event =>
    event->eventRouter(~chainId=chainConfig.chainId)
  )

  await DbFunctions.sql->IO.executeBatch
}
