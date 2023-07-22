//*************
//***ENTITIES**
//*************

@spice @genType.as("Id")
type id = string

//nested subrecord types

@@warning("-30")
@genType
type rec nftcollectionLoaderConfig = bool
and userLoaderConfig = bool
and tokenLoaderConfig = {loadCollection?: nftcollectionLoaderConfig, loadOwner?: userLoaderConfig}

@@warning("+30")

type entityRead =
  | NftcollectionRead(id)
  | UserRead(id)
  | TokenRead(id, tokenLoaderConfig)

let entitySerialize = (entity: entityRead) => {
  switch entity {
  | NftcollectionRead(id) => `nftcollection${id}`
  | UserRead(id) => `user${id}`
  | TokenRead(id, _) => `token${id}`
  }
}

type rawEventsEntity = {
  @as("chain_id") chainId: int,
  @as("event_id") eventId: string,
  @as("block_number") blockNumber: int,
  @as("log_index") logIndex: int,
  @as("transaction_index") transactionIndex: int,
  @as("transaction_hash") transactionHash: string,
  @as("src_address") srcAddress: Ethers.ethAddress,
  @as("block_hash") blockHash: string,
  @as("block_timestamp") blockTimestamp: int,
  @as("event_type") eventType: Js.Json.t,
  params: string,
}

type dynamicContractRegistryEntity = {
  @as("chain_id") chainId: int,
  @as("event_id") eventId: Ethers.BigInt.t,
  @as("contract_address") contractAddress: Ethers.ethAddress,
  @as("contract_type") contractType: string,
}

@spice @genType
type nftcollectionEntity = {
  id: string,
  contractAddress: string,
  name?: string,
  symbol?: string,
  maxSupply?: Ethers.BigInt.t,
  currentSupply?: int,
}

@spice @genType
type userEntity = {
  id: string,
  address: string,
}

@spice @genType
type tokenEntity = {
  id: string,
  tokenId: Ethers.BigInt.t,
  collection: id,
  owner: id,
}

type entity =
  | NftcollectionEntity(nftcollectionEntity)
  | UserEntity(userEntity)
  | TokenEntity(tokenEntity)

type dbOp = Read | Set | Delete

type eventData = {
  @as("event_chain_id") chainId: int,
  @as("event_id") eventId: string,
}

type inMemoryStoreRow<'a> = {
  dbOp: dbOp,
  entity: 'a,
  eventData: eventData,
}

//*************
//**CONTRACTS**
//*************

@genType
type eventLog<'a> = {
  params: 'a,
  blockNumber: int,
  blockTimestamp: int,
  blockHash: string,
  srcAddress: Ethers.ethAddress,
  transactionHash: string,
  transactionIndex: int,
  logIndex: int,
}

module ERC721Contract = {
  module TransferEvent = {
    @spice @genType
    type eventArgs = {
      from: Ethers.ethAddress,
      to: Ethers.ethAddress,
      tokenId: Ethers.BigInt.t,
    }
    type nftcollectionEntityHandlerContext = {
      nftCollectionUpdated: unit => option<nftcollectionEntity>,
      set: nftcollectionEntity => unit,
      delete: id => unit,
    }
    type userEntityHandlerContext = {
      userFrom: unit => option<userEntity>,
      userTo: unit => option<userEntity>,
      set: userEntity => unit,
      delete: id => unit,
    }
    type tokenEntityHandlerContext = {
      existingTransferredToken: unit => option<tokenEntity>,
      getCollection: tokenEntity => nftcollectionEntity,
      getOwner: tokenEntity => userEntity,
      set: tokenEntity => unit,
      delete: id => unit,
    }
    @genType
    type context = {
      log: Logs.userLogger,
      nftcollection: nftcollectionEntityHandlerContext,
      user: userEntityHandlerContext,
      token: tokenEntityHandlerContext,
    }

    @genType
    type userEntityLoaderContext = {
      userFromLoad: id => unit,
      userToLoad: id => unit,
    }
    @genType
    type nftcollectionEntityLoaderContext = {nftCollectionUpdatedLoad: id => unit}
    @genType
    type tokenEntityLoaderContext = {
      existingTransferredTokenLoad: (id, ~loaders: tokenLoaderConfig=?) => unit,
    }

    @genType
    type contractRegistrations = {
      //TODO only add contracts we've registered for the event in the config
      addERC721: Ethers.ethAddress => unit,
    }
    @genType
    type loaderContext = {
      contractRegistration: contractRegistrations,
      user: userEntityLoaderContext,
      nftcollection: nftcollectionEntityLoaderContext,
      token: tokenEntityLoaderContext,
    }
  }
}

type event = ERC721Contract_Transfer(eventLog<ERC721Contract.TransferEvent.eventArgs>)

type eventAndContext =
  | ERC721Contract_TransferWithContext(
      eventLog<ERC721Contract.TransferEvent.eventArgs>,
      ERC721Contract.TransferEvent.context,
    )

@spice
type eventName = | @spice.as("ERC721Contract_TransferEvent") ERC721Contract_TransferEvent

let eventNameToString = (eventName: eventName) =>
  switch eventName {
  | ERC721Contract_TransferEvent => "Transfer"
  }
