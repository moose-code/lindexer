module ERC721Contract = {
  module TransferEvent = {
    type context = Types.ERC721Contract.TransferEvent.context

    type contextCreatorFunctions = {
      getLoaderContext: unit => Types.ERC721Contract.TransferEvent.loaderContext,
      getContext: (~eventData: Types.eventData) => Types.ERC721Contract.TransferEvent.context,
      getEntitiesToLoad: unit => array<Types.entityRead>,
      getAddedDynamicContractRegistrations: unit => array<Types.dynamicContractRegistryEntity>,
    }
    let contextCreator: (
      ~chainId: int,
      ~event: Types.eventLog<'a>,
      ~logger: Pino.t,
    ) => contextCreatorFunctions = (~chainId, ~event, ~logger) => {
      let logger =
        logger->Logging.createChildFrom(~logger=_, ~params={"userLog": "ERC721.Transfer.context"})
      let optIdOf_userFrom = ref(None)
      let optIdOf_userTo = ref(None)
      let optIdOf_nftCollectionUpdated = ref(None)
      let optIdOf_existingTransferredToken = ref(None)

      let entitiesToLoad: array<Types.entityRead> = []

      let addedDynamicContractRegistrations: array<Types.dynamicContractRegistryEntity> = []

      @warning("-16")
      let loaderContext: Types.ERC721Contract.TransferEvent.loaderContext = {
        contractRegistration: {
          //TODO only add contracts we've registered for the event in the config
          addERC721: (contractAddress: Ethers.ethAddress) => {
            let eventId = EventUtils.packEventIndex(
              ~blockNumber=event.blockNumber,
              ~logIndex=event.logIndex,
            )
            let dynamicContractRegistration: Types.dynamicContractRegistryEntity = {
              chainId,
              eventId,
              contractAddress,
              contractType: "ERC721",
            }

            addedDynamicContractRegistrations->Js.Array2.push(dynamicContractRegistration)->ignore

            IO.InMemoryStore.DynamicContractRegistry.setDynamicContractRegistry(
              ~entity=dynamicContractRegistration,
            )

            Converters.ContractNameAddressMappings.addContractAddress(
              ~chainId,
              ~contractAddress,
              ~contractName="ERC721",
            )
          },
        },
        user: {
          userFromLoad: (id: Types.id) => {
            optIdOf_userFrom := Some(id)

            let _ = Js.Array2.push(entitiesToLoad, Types.UserRead(id))
          },
          userToLoad: (id: Types.id) => {
            optIdOf_userTo := Some(id)

            let _ = Js.Array2.push(entitiesToLoad, Types.UserRead(id))
          },
        },
        nftcollection: {
          nftCollectionUpdatedLoad: (id: Types.id) => {
            optIdOf_nftCollectionUpdated := Some(id)

            let _ = Js.Array2.push(entitiesToLoad, Types.NftcollectionRead(id))
          },
        },
        token: {
          existingTransferredTokenLoad: (id: Types.id, ~loaders={}) => {
            optIdOf_existingTransferredToken := Some(id)

            let _ = Js.Array2.push(entitiesToLoad, Types.TokenRead(id, loaders))
          },
        },
      }
      {
        getEntitiesToLoad: () => entitiesToLoad,
        getAddedDynamicContractRegistrations: () => addedDynamicContractRegistrations,
        getLoaderContext: () => loaderContext,
        getContext: (~eventData) => {
          log: {
            info: (message: string) => logger->Logging.uinfo(message),
            debug: (message: string) => logger->Logging.udebug(message),
            warn: (message: string) => logger->Logging.uwarn(message),
            error: (message: string) => logger->Logging.uerror(message),
            errorWithExn: (exn: exn, message: string) =>
              logger->Logging.uerrorWithExn(exn, message),
          },
          nftcollection: {
            set: entity => {
              IO.InMemoryStore.Nftcollection.setNftcollection(~entity, ~dbOp=Types.Set, ~eventData)
            },
            delete: id =>
              Logging.warn(
                `[unimplemented delete] can't delete entity(nftcollection) with ID ${id}.`,
              ),
            nftCollectionUpdated: () =>
              optIdOf_nftCollectionUpdated.contents->Belt.Option.flatMap(id =>
                IO.InMemoryStore.Nftcollection.getNftcollection(~id)
              ),
          },
          user: {
            set: entity => {IO.InMemoryStore.User.setUser(~entity, ~dbOp=Types.Set, ~eventData)},
            delete: id =>
              Logging.warn(`[unimplemented delete] can't delete entity(user) with ID ${id}.`),
            userFrom: () =>
              optIdOf_userFrom.contents->Belt.Option.flatMap(id =>
                IO.InMemoryStore.User.getUser(~id)
              ),
            userTo: () =>
              optIdOf_userTo.contents->Belt.Option.flatMap(id =>
                IO.InMemoryStore.User.getUser(~id)
              ),
          },
          token: {
            set: entity => {IO.InMemoryStore.Token.setToken(~entity, ~dbOp=Types.Set, ~eventData)},
            delete: id =>
              Logging.warn(`[unimplemented delete] can't delete entity(token) with ID ${id}.`),
            existingTransferredToken: () =>
              optIdOf_existingTransferredToken.contents->Belt.Option.flatMap(id =>
                IO.InMemoryStore.Token.getToken(~id)
              ),
            getCollection: token => {
              let optCollection = IO.InMemoryStore.Nftcollection.getNftcollection(
                ~id=token.collection,
              )
              switch optCollection {
              | Some(collection) => collection
              | None =>
                Logging.warn(`Token collection data not found. Loading associated nftcollection from database.
Please consider loading the nftcollection in the UpdateToken entity loader to greatly improve sync speed of your application.
`)
                // TODO: this isn't implemented yet. We should fetch a nftcollection with this ID from the database.
                "NOT_IMPLEMENTED_YET"->Obj.magic
              }
            },
            getOwner: token => {
              let optOwner = IO.InMemoryStore.User.getUser(~id=token.owner)
              switch optOwner {
              | Some(owner) => owner
              | None =>
                Logging.warn(`Token owner data not found. Loading associated user from database.
Please consider loading the user in the UpdateToken entity loader to greatly improve sync speed of your application.
`)
                // TODO: this isn't implemented yet. We should fetch a user with this ID from the database.
                "NOT_IMPLEMENTED_YET"->Obj.magic
              }
            },
          },
        },
      }
    }
  }
}
