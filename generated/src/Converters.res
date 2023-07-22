type contractName = string
type chainId = int
exception UndefinedEvent(string)
exception UndefinedContractAddress(Ethers.ethAddress, chainId)
exception UndefinedContractName(contractName, chainId)

module ContractNameAddressMappings: {
  let getContractNameFromAddress: (~chainId: int, ~contractAddress: Ethers.ethAddress) => string
  let addContractAddress: (
    ~chainId: int,
    ~contractName: string,
    ~contractAddress: Ethers.ethAddress,
  ) => unit
  let getAddressesFromContractName: (
    ~chainId: int,
    ~contractName: string,
  ) => array<Ethers.ethAddress>
  let registerStaticAddresses: (~chainConfig: Config.chainConfig, ~logger: Pino.t) => unit
} = {
  let globalMutable = ContractAddressingMap.makeChainMappings()

  let addContractAddress = (
    ~chainId: int,
    ~contractName: string,
    ~contractAddress: Ethers.ethAddress,
  ) => {
    globalMutable->ContractAddressingMap.addChainAddress(~chainId, ~contractName, ~contractAddress)
  }

  let getContractNameFromAddress = (~chainId: int, ~contractAddress: Ethers.ethAddress) => {
    switch globalMutable->ContractAddressingMap.getChainRegistry(~chainId) {
    | None =>
      Logging.error(`chainId ${chainId->Belt.Int.toString} was not constructed in address mapping`)
      UndefinedContractAddress(contractAddress, chainId)->raise
    | Some(registry) =>
      switch ContractAddressingMap.getName(registry, contractAddress->Ethers.ethAddressToString) {
      | None => {
          Logging.error(
            `contract address ${contractAddress->Ethers.ethAddressToString} on chainId ${chainId->Belt.Int.toString} was not found in address store`,
          )
          UndefinedContractAddress(contractAddress, chainId)->raise
        }

      | Some(contractName) => contractName
      }
    }
  }

  let stringsToAddresses: array<string> => array<Ethers.ethAddress> = Obj.magic

  let getAddressesFromContractName = (~chainId, ~contractName) => {
    switch globalMutable->ContractAddressingMap.getChainRegistry(~chainId) {
    | None => {
        Logging.error(
          `chainId ${chainId->Belt.Int.toString} was not constructed in address mapping`,
        )
        UndefinedContractName(contractName, chainId)->raise
      }

    | Some(registry) =>
      switch ContractAddressingMap.getAddresses(registry, contractName) {
      | Some(addresses) => addresses
      | None => Belt.Set.String.empty
      }
      ->Belt.Set.String.toArray
      ->stringsToAddresses
    }
  }

  // Insert the static address into the Contract <-> Address bi-mapping
  let registerStaticAddresses = (~chainConfig: Config.chainConfig, ~logger: Pino.t) => {
    chainConfig.contracts->Belt.Array.forEach(contract => {
      contract.addresses->Belt.Array.forEach(address => {
        Logging.childTrace(
          logger,
          {
            "msg": "adding contract address",
            "contractName": contract.name,
            "address": address,
          },
        )

        globalMutable->ContractAddressingMap.addChainAddress(
          ~chainId=chainConfig.chainId,
          ~contractName=contract.name,
          ~contractAddress=address,
        )
      })
    })
  }
}

let eventStringToEvent = (eventName: string, contractName: string): Types.eventName => {
  switch (eventName, contractName) {
  | ("Transfer", "ERC721") => ERC721Contract_TransferEvent
  | _ => UndefinedEvent(eventName)->raise
  }
}

module ERC721 = {
  let convertTransferLogDescription = (log: Ethers.logDescription<'a>): Ethers.logDescription<
    Types.ERC721Contract.TransferEvent.eventArgs,
  > => {
    log->Obj.magic
  }

  let convertTransferLog = async (
    logDescription: Ethers.logDescription<Types.ERC721Contract.TransferEvent.eventArgs>,
    ~log: Ethers.log,
    ~blockPromise: promise<Ethers.JsonRpcProvider.block>,
  ) => {
    let params: Types.ERC721Contract.TransferEvent.eventArgs = {
      from: logDescription.args.from,
      to: logDescription.args.to,
      tokenId: logDescription.args.tokenId,
    }
    let block = await blockPromise

    let transferLog: Types.eventLog<Types.ERC721Contract.TransferEvent.eventArgs> = {
      params,
      blockNumber: block.number,
      blockTimestamp: block.timestamp,
      blockHash: log.blockHash,
      srcAddress: log.address,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
      logIndex: log.logIndex,
    }
    Types.ERC721Contract_Transfer(transferLog)
  }
}
