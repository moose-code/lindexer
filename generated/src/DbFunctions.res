let config: Postgres.poolConfig = {
  ...Config.db,
  transform: {undefined: Js.null},
}
let sql = Postgres.makeSql(~config)

type chainId = int
type eventId = string
type blockNumberRow = {@as("block_number") blockNumber: int}

module RawEvents = {
  type rawEventRowId = (chainId, eventId)
  @module("./DbFunctionsImplementation.js")
  external batchSetRawEvents: (Postgres.sql, array<Types.rawEventsEntity>) => promise<unit> =
    "batchSetRawEvents"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteRawEvents: (Postgres.sql, array<rawEventRowId>) => promise<unit> =
    "batchDeleteRawEvents"

  @module("./DbFunctionsImplementation.js")
  external readRawEventsEntities: (
    Postgres.sql,
    array<rawEventRowId>,
  ) => promise<array<Types.rawEventsEntity>> = "readRawEventsEntities"

  ///Returns an array with 1 block number (the highest processed on the given chainId)
  @module("./DbFunctionsImplementation.js")
  external readLatestRawEventsBlockNumberProcessedOnChainId: (
    Postgres.sql,
    chainId,
  ) => promise<array<blockNumberRow>> = "readLatestRawEventsBlockNumberProcessedOnChainId"

  let getLatestProcessedBlockNumber = async (~chainId) => {
    let row = await sql->readLatestRawEventsBlockNumberProcessedOnChainId(chainId)

    row->Belt.Array.get(0)->Belt.Option.map(row => row.blockNumber)
  }
}

module DynamicContractRegistry = {
  type contractAddress = Ethers.ethAddress
  type dynamicContractRegistryRowId = (chainId, contractAddress)
  @module("./DbFunctionsImplementation.js")
  external batchSetDynamicContractRegistry: (
    Postgres.sql,
    array<Types.dynamicContractRegistryEntity>,
  ) => promise<unit> = "batchSetDynamicContractRegistry"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteDynamicContractRegistry: (
    Postgres.sql,
    array<dynamicContractRegistryRowId>,
  ) => promise<unit> = "batchDeleteDynamicContractRegistry"

  @module("./DbFunctionsImplementation.js")
  external readDynamicContractRegistryEntities: (
    Postgres.sql,
    array<dynamicContractRegistryRowId>,
  ) => promise<array<Types.dynamicContractRegistryEntity>> = "readDynamicContractRegistryEntities"

  type contractTypeAndAddress = {
    @as("contract_address") contractAddress: Ethers.ethAddress,
    @as("contract_type") contractType: string,
  }
  ///Returns an array with 1 block number (the highest processed on the given chainId)
  @module("./DbFunctionsImplementation.js")
  external readDynamicContractsOnChainIdAtOrBeforeBlock: (
    Postgres.sql,
    ~chainId: chainId,
    ~startBlock: int,
  ) => promise<array<contractTypeAndAddress>> = "readDynamicContractsOnChainIdAtOrBeforeBlock"
}

type readEntityData<'a> = {
  entity: 'a,
  eventData: Types.eventData,
}

module Nftcollection = {
  open Types
  type nftcollectionReadRow = {
    id: string,
    contractAddress: string,
    name: option<string>,
    symbol: option<string>,
    maxSupply: option<string>,
    currentSupply: int,
    @as("event_chain_id") chainId: int,
    @as("event_id") eventId: Ethers.BigInt.t,
  }

  let readRowToReadEntityData = (readRow: nftcollectionReadRow): readEntityData<
    Types.nftcollectionEntity,
  > => {
    let {id, contractAddress, name, symbol, maxSupply, currentSupply, chainId, eventId} = readRow

    let maxSupply = maxSupply->Belt.Option.flatMap(bn => bn->Ethers.BigInt.fromString)
    {
      entity: {
        id,
        contractAddress,
        ?name,
        ?symbol,
        ?maxSupply,
        currentSupply,
      },
      eventData: {
        chainId,
        eventId: eventId->Ethers.BigInt.toString,
      },
    }
  }
  @module("./DbFunctionsImplementation.js")
  external batchSetNftcollection: (
    Postgres.sql,
    array<Types.inMemoryStoreRow<Js.Json.t>>,
  ) => promise<unit> = "batchSetNftcollection"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteNftcollection: (Postgres.sql, array<Types.id>) => promise<unit> =
    "batchDeleteNftcollection"

  @module("./DbFunctionsImplementation.js")
  external readNftcollectionEntities: (
    Postgres.sql,
    array<Types.id>,
  ) => promise<array<nftcollectionReadRow>> = "readNftcollectionEntities"
}
module User = {
  open Types
  type userReadRow = {
    id: string,
    tokens: array<id>,
    @as("event_chain_id") chainId: int,
    @as("event_id") eventId: Ethers.BigInt.t,
  }

  let readRowToReadEntityData = (readRow: userReadRow): readEntityData<Types.userEntity> => {
    let {id, chainId, eventId} = readRow

    {
      entity: {
        id: id,
      },
      eventData: {
        chainId,
        eventId: eventId->Ethers.BigInt.toString,
      },
    }
  }
  @module("./DbFunctionsImplementation.js")
  external batchSetUser: (Postgres.sql, array<Types.inMemoryStoreRow<Js.Json.t>>) => promise<unit> =
    "batchSetUser"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteUser: (Postgres.sql, array<Types.id>) => promise<unit> = "batchDeleteUser"

  @module("./DbFunctionsImplementation.js")
  external readUserEntities: (Postgres.sql, array<Types.id>) => promise<array<userReadRow>> =
    "readUserEntities"
}
module Token = {
  open Types
  type tokenReadRow = {
    id: string,
    tokenId: string,
    collection: id,
    owner: id,
    @as("event_chain_id") chainId: int,
    @as("event_id") eventId: Ethers.BigInt.t,
  }

  let readRowToReadEntityData = (readRow: tokenReadRow): readEntityData<Types.tokenEntity> => {
    let {id, tokenId, collection, owner, chainId, eventId} = readRow

    {
      entity: {
        id,
        tokenId: tokenId->Ethers.BigInt.fromStringUnsafe,
        collection,
        owner,
      },
      eventData: {
        chainId,
        eventId: eventId->Ethers.BigInt.toString,
      },
    }
  }
  @module("./DbFunctionsImplementation.js")
  external batchSetToken: (
    Postgres.sql,
    array<Types.inMemoryStoreRow<Js.Json.t>>,
  ) => promise<unit> = "batchSetToken"

  @module("./DbFunctionsImplementation.js")
  external batchDeleteToken: (Postgres.sql, array<Types.id>) => promise<unit> = "batchDeleteToken"

  @module("./DbFunctionsImplementation.js")
  external readTokenEntities: (Postgres.sql, array<Types.id>) => promise<array<tokenReadRow>> =
    "readTokenEntities"
}
