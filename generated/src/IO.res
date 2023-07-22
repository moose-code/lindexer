module InMemoryStore = {
  let entityCurrentCrud = (currentCrud: option<Types.dbOp>, nextCrud: Types.dbOp): Types.dbOp => {
    switch (currentCrud, nextCrud) {
    | (Some(Set), Read)
    | (_, Set) =>
      Set
    | (Some(Read), Read) => Read
    | (Some(Delete), Read)
    | (_, Delete) =>
      Delete
    | (None, _) => nextCrud
    }
  }

  module RawEvents = {
    let rawEventsDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.rawEventsEntity>>> = ref(
      Js.Dict.empty(),
    )

    let getRawEvents = (~id: string) => {
      let row = Js.Dict.get(rawEventsDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setRawEvents = (~entity: Types.rawEventsEntity) => {
      let key = EventUtils.getEventIdKeyString(~chainId=entity.chainId, ~eventId=entity.eventId)

      rawEventsDict.contents->Js.Dict.set(
        key,
        {eventData: {chainId: entity.chainId, eventId: entity.eventId}, entity, dbOp: Set},
      )
    }
  }
  module DynamicContractRegistry = {
    let dynamicContractRegistryDict: ref<
      Js.Dict.t<Types.inMemoryStoreRow<Types.dynamicContractRegistryEntity>>,
    > = ref(Js.Dict.empty())

    let getDynamicContractRegistry = (~id: string) => {
      let row = Js.Dict.get(dynamicContractRegistryDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setDynamicContractRegistry = (~entity: Types.dynamicContractRegistryEntity) => {
      let key = EventUtils.getContractAddressKeyString(
        ~chainId=entity.chainId,
        ~contractAddress=entity.contractAddress,
      )
      /// NOTE: currently deleting dynamic contracts in unimplemented,so the dbOp/dbOperation type is always 'Set'
      // let dynamicContractRegistryCurrentCrud =
      //   dynamicContractRegistryDict.contents
      //   ->Js.Dict.get(key)
      //   ->Belt.Option.map(row => {
      //     row.dbOp
      //   })

      dynamicContractRegistryDict.contents->Js.Dict.set(
        key,
        {
          eventData: {chainId: entity.chainId, eventId: entity.eventId->Ethers.BigInt.toString},
          entity,
          dbOp: Types.Set,
        },
      )
    }
  }

  module Nftcollection = {
    let nftcollectionDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.nftcollectionEntity>>> = ref(
      Js.Dict.empty(),
    )

    let getNftcollection = (~id: string) => {
      let row = Js.Dict.get(nftcollectionDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setNftcollection = (
      ~entity: Types.nftcollectionEntity,
      ~dbOp: Types.dbOp,
      ~eventData: Types.eventData,
    ) => {
      let nftcollectionCurrentCrud = Js.Dict.get(
        nftcollectionDict.contents,
        entity.id,
      )->Belt.Option.map(row => {
        row.dbOp
      })

      nftcollectionDict.contents->Js.Dict.set(
        entity.id,
        {eventData, entity, dbOp: entityCurrentCrud(nftcollectionCurrentCrud, dbOp)},
      )
    }
  }

  module User = {
    let userDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.userEntity>>> = ref(Js.Dict.empty())

    let getUser = (~id: string) => {
      let row = Js.Dict.get(userDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setUser = (~entity: Types.userEntity, ~dbOp: Types.dbOp, ~eventData: Types.eventData) => {
      let userCurrentCrud = Js.Dict.get(userDict.contents, entity.id)->Belt.Option.map(row => {
        row.dbOp
      })

      userDict.contents->Js.Dict.set(
        entity.id,
        {eventData, entity, dbOp: entityCurrentCrud(userCurrentCrud, dbOp)},
      )
    }
  }

  module Token = {
    let tokenDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.tokenEntity>>> = ref(Js.Dict.empty())

    let getToken = (~id: string) => {
      let row = Js.Dict.get(tokenDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setToken = (~entity: Types.tokenEntity, ~dbOp: Types.dbOp, ~eventData: Types.eventData) => {
      let tokenCurrentCrud = Js.Dict.get(tokenDict.contents, entity.id)->Belt.Option.map(row => {
        row.dbOp
      })

      tokenDict.contents->Js.Dict.set(
        entity.id,
        {eventData, entity, dbOp: entityCurrentCrud(tokenCurrentCrud, dbOp)},
      )
    }
  }

  module Metadata = {
    let metadataDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.metadataEntity>>> = ref(
      Js.Dict.empty(),
    )

    let getMetadata = (~id: string) => {
      let row = Js.Dict.get(metadataDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setMetadata = (
      ~entity: Types.metadataEntity,
      ~dbOp: Types.dbOp,
      ~eventData: Types.eventData,
    ) => {
      let metadataCurrentCrud = Js.Dict.get(
        metadataDict.contents,
        entity.id,
      )->Belt.Option.map(row => {
        row.dbOp
      })

      metadataDict.contents->Js.Dict.set(
        entity.id,
        {eventData, entity, dbOp: entityCurrentCrud(metadataCurrentCrud, dbOp)},
      )
    }
  }

  module Attribute = {
    let attributeDict: ref<Js.Dict.t<Types.inMemoryStoreRow<Types.attributeEntity>>> = ref(
      Js.Dict.empty(),
    )

    let getAttribute = (~id: string) => {
      let row = Js.Dict.get(attributeDict.contents, id)
      row->Belt.Option.map(row => row.entity)
    }

    let setAttribute = (
      ~entity: Types.attributeEntity,
      ~dbOp: Types.dbOp,
      ~eventData: Types.eventData,
    ) => {
      let attributeCurrentCrud = Js.Dict.get(
        attributeDict.contents,
        entity.id,
      )->Belt.Option.map(row => {
        row.dbOp
      })

      attributeDict.contents->Js.Dict.set(
        entity.id,
        {eventData, entity, dbOp: entityCurrentCrud(attributeCurrentCrud, dbOp)},
      )
    }
  }
  let resetStore = () => {
    Nftcollection.nftcollectionDict := Js.Dict.empty()
    User.userDict := Js.Dict.empty()
    Token.tokenDict := Js.Dict.empty()
    Metadata.metadataDict := Js.Dict.empty()
    Attribute.attributeDict := Js.Dict.empty()
  }
}

type uniqueEntityReadIds = Js.Dict.t<Types.id>
type allEntityReads = Js.Dict.t<uniqueEntityReadIds>

let loadEntities = async (sql, entityBatch: array<Types.entityRead>) => {
  let loadLayer = ref(false)

  let uniqueNftcollectionDict = Js.Dict.empty()
  let uniqueUserDict = Js.Dict.empty()
  let uniqueTokenDict = Js.Dict.empty()
  let uniqueMetadataDict = Js.Dict.empty()
  let uniqueAttributeDict = Js.Dict.empty()

  let populateLoadAsEntityFunctions: ref<array<unit => unit>> = ref([])

  let uniqueNftcollectionAsEntityFieldArray: ref<array<string>> = ref([])
  let uniqueUserAsEntityFieldArray: ref<array<string>> = ref([])
  let uniqueTokenAsEntityFieldArray: ref<array<string>> = ref([])
  let uniqueMetadataAsEntityFieldArray: ref<array<string>> = ref([])
  let uniqueAttributeAsEntityFieldArray: ref<array<string>> = ref([])

  let rec nftcollectionLinkedEntityLoader = (entityId: string, layer: int) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueNftcollectionDict, entityId)->Belt.Option.isNone {
      let _ = uniqueNftcollectionAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueNftcollectionDict, entityId, entityId)
    }

    ()
  }
  @warning("-27")
  and userLinkedEntityLoader = (entityId: string, layer: int) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueUserDict, entityId)->Belt.Option.isNone {
      let _ = uniqueUserAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueUserDict, entityId, entityId)
    }

    ()
  }
  @warning("-27")
  and tokenLinkedEntityLoader = (
    entityId: string,
    tokenLoad: Types.tokenLoaderConfig,
    layer: int,
  ) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueTokenDict, entityId)->Belt.Option.isNone {
      let _ = uniqueTokenAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueTokenDict, entityId, entityId)
    }

    //Loader is not used in every generated case
    //Suppressing unused variable warning 27 for these cases

    @warning("-27")
    switch tokenLoad.loadCollection {
    | Some(loadNftcollection) =>
      let _ = populateLoadAsEntityFunctions.contents->Js.Array2.push(() => {
        let _ = InMemoryStore.Token.getToken(~id=entityId)->Belt.Option.map(tokenEntity => {
          let _ = nftcollectionLinkedEntityLoader(tokenEntity.collection, layer + 1)
        })
      })
    | None => ()
    }
    //Loader is not used in every generated case
    //Suppressing unused variable warning 27 for these cases

    @warning("-27")
    switch tokenLoad.loadOwner {
    | Some(loadUser) =>
      let _ = populateLoadAsEntityFunctions.contents->Js.Array2.push(() => {
        let _ = InMemoryStore.Token.getToken(~id=entityId)->Belt.Option.map(tokenEntity => {
          let _ = userLinkedEntityLoader(tokenEntity.owner, layer + 1)
        })
      })
    | None => ()
    }
    ()
  }
  @warning("-27")
  and metadataLinkedEntityLoader = (entityId: string, layer: int) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueMetadataDict, entityId)->Belt.Option.isNone {
      let _ = uniqueMetadataAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueMetadataDict, entityId, entityId)
    }

    ()
  }
  @warning("-27")
  and attributeLinkedEntityLoader = (entityId: string, layer: int) => {
    if !loadLayer.contents {
      // NOTE: Always set this to true if it is false, I'm sure there are optimizations. Correctness over optimization for now.
      loadLayer := true
    }
    if Js.Dict.get(uniqueAttributeDict, entityId)->Belt.Option.isNone {
      let _ = uniqueAttributeAsEntityFieldArray.contents->Js.Array2.push(entityId)
      let _ = Js.Dict.set(uniqueAttributeDict, entityId, entityId)
    }

    ()
  }

  entityBatch->Belt.Array.forEach(readEntity => {
    switch readEntity {
    | NftcollectionRead(entityId) => nftcollectionLinkedEntityLoader(entityId, 0)
    | UserRead(entityId) => userLinkedEntityLoader(entityId, 0)
    | TokenRead(entityId, tokenLoad) => tokenLinkedEntityLoader(entityId, tokenLoad, 0)
    | MetadataRead(entityId) => metadataLinkedEntityLoader(entityId, 0)
    | AttributeRead(entityId) => attributeLinkedEntityLoader(entityId, 0)
    }
  })

  while loadLayer.contents {
    loadLayer := false

    if uniqueNftcollectionAsEntityFieldArray.contents->Array.length > 0 {
      let nftcollectionFieldEntitiesArray =
        await sql->DbFunctions.Nftcollection.readNftcollectionEntities(
          uniqueNftcollectionAsEntityFieldArray.contents,
        )

      nftcollectionFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity, eventData} = DbFunctions.Nftcollection.readRowToReadEntityData(readRow)
        InMemoryStore.Nftcollection.setNftcollection(~entity, ~eventData, ~dbOp=Types.Read)
      })

      uniqueNftcollectionAsEntityFieldArray := []
    }
    if uniqueUserAsEntityFieldArray.contents->Array.length > 0 {
      let userFieldEntitiesArray =
        await sql->DbFunctions.User.readUserEntities(uniqueUserAsEntityFieldArray.contents)

      userFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity, eventData} = DbFunctions.User.readRowToReadEntityData(readRow)
        InMemoryStore.User.setUser(~entity, ~eventData, ~dbOp=Types.Read)
      })

      uniqueUserAsEntityFieldArray := []
    }
    if uniqueTokenAsEntityFieldArray.contents->Array.length > 0 {
      let tokenFieldEntitiesArray =
        await sql->DbFunctions.Token.readTokenEntities(uniqueTokenAsEntityFieldArray.contents)

      tokenFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity, eventData} = DbFunctions.Token.readRowToReadEntityData(readRow)
        InMemoryStore.Token.setToken(~entity, ~eventData, ~dbOp=Types.Read)
      })

      uniqueTokenAsEntityFieldArray := []
    }
    if uniqueMetadataAsEntityFieldArray.contents->Array.length > 0 {
      let metadataFieldEntitiesArray =
        await sql->DbFunctions.Metadata.readMetadataEntities(
          uniqueMetadataAsEntityFieldArray.contents,
        )

      metadataFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity, eventData} = DbFunctions.Metadata.readRowToReadEntityData(readRow)
        InMemoryStore.Metadata.setMetadata(~entity, ~eventData, ~dbOp=Types.Read)
      })

      uniqueMetadataAsEntityFieldArray := []
    }
    if uniqueAttributeAsEntityFieldArray.contents->Array.length > 0 {
      let attributeFieldEntitiesArray =
        await sql->DbFunctions.Attribute.readAttributeEntities(
          uniqueAttributeAsEntityFieldArray.contents,
        )

      attributeFieldEntitiesArray->Belt.Array.forEach(readRow => {
        let {entity, eventData} = DbFunctions.Attribute.readRowToReadEntityData(readRow)
        InMemoryStore.Attribute.setAttribute(~entity, ~eventData, ~dbOp=Types.Read)
      })

      uniqueAttributeAsEntityFieldArray := []
    }

    let functionsToExecute = populateLoadAsEntityFunctions.contents

    populateLoadAsEntityFunctions := []

    functionsToExecute->Belt.Array.forEach(func => func())
  }
}

let executeBatch = async sql => {
  let rawEventsRows = InMemoryStore.RawEvents.rawEventsDict.contents->Js.Dict.values

  let setRawEventsPromise = sql => {
    // NOTE: This is commented out because raw events are always 'Set' operations. Likely that will stay the case even with reorgs protections in place since it'll just re-run the batch rather than edit a partially run batch.
    // TODO: remove if not necessary
    // let setRawEvents =
    //   rawEventsRows->Belt.Array.keepMap(rawEventsRow =>
    //     rawEventsRow.dbOp == Types.Set
    //       ? Some(rawEventsRow.entity)
    //       : None
    //   )
    let rawEventsToSet = rawEventsRows->Belt.Array.map(rawEventsRow => rawEventsRow.entity)

    if rawEventsToSet->Belt.Array.length > 0 {
      sql->DbFunctions.RawEvents.batchSetRawEvents(rawEventsToSet)
    } else {
      ()->Promise.resolve
    }
  }

  let dynamicContractRegistryRows =
    InMemoryStore.DynamicContractRegistry.dynamicContractRegistryDict.contents->Js.Dict.values

  // // NOTE: currently deleting dynamic contracts in unimplemented
  // let deleteDynamicContractRegistryIdsPromise = sql => {
  //   let deleteDynamicContractRegistryIds =
  //     dynamicContractRegistryRows
  //     ->Belt.Array.keepMap(dynamicContractRegistryRow =>
  //       dynamicContractRegistryRow.dbOp == Types.Delete
  //         ? Some(dynamicContractRegistryRow.entity)
  //         : None
  //     )
  //     ->Belt.Array.map(dynamicContractRegistry => (
  //       dynamicContractRegistry.chainId,
  //       dynamicContractRegistry.contractAddress,
  //     ))

  //   if deleteDynamicContractRegistryIds->Belt.Array.length > 0 {
  //     sql->DbFunctions.DynamicContractRegistry.batchDeleteDynamicContractRegistry(
  //       deleteDynamicContractRegistryIds,
  //     )
  //   } else {
  //     ()->Promise.resolve
  //   }
  // }

  let setDynamicContractRegistryPromise = sql => {
    let setDynamicContractRegistry =
      dynamicContractRegistryRows->Belt.Array.keepMap(dynamicContractRegistryRow =>
        // NOTE: the currently they will all be of type 'Set', but in the future we may add functionality to also delete contracts from the registry.
        dynamicContractRegistryRow.dbOp == Types.Set
          ? Some(dynamicContractRegistryRow.entity)
          : None
      )

    if setDynamicContractRegistry->Belt.Array.length > 0 {
      sql->DbFunctions.DynamicContractRegistry.batchSetDynamicContractRegistry(
        setDynamicContractRegistry,
      )
    } else {
      ()->Promise.resolve
    }
  }

  let nftcollectionRows = InMemoryStore.Nftcollection.nftcollectionDict.contents->Js.Dict.values

  let deleteNftcollectionIdsPromise = sql => {
    let deleteNftcollectionIds =
      nftcollectionRows
      ->Belt.Array.keepMap(nftcollectionRow =>
        nftcollectionRow.dbOp == Types.Delete ? Some(nftcollectionRow.entity) : None
      )
      ->Belt.Array.map(nftcollection => nftcollection.id)

    if deleteNftcollectionIds->Belt.Array.length > 0 {
      sql->DbFunctions.Nftcollection.batchDeleteNftcollection(deleteNftcollectionIds)
    } else {
      ()->Promise.resolve
    }
  }
  let setNftcollectionPromise = sql => {
    let setNftcollection = nftcollectionRows->Belt.Array.keepMap(nftcollectionRow =>
      nftcollectionRow.dbOp == Types.Set
        ? Some({
            ...nftcollectionRow,
            entity: nftcollectionRow.entity->Types.nftcollectionEntity_encode,
          })
        : None
    )

    if setNftcollection->Belt.Array.length > 0 {
      sql->DbFunctions.Nftcollection.batchSetNftcollection(setNftcollection)
    } else {
      ()->Promise.resolve
    }
  }

  let userRows = InMemoryStore.User.userDict.contents->Js.Dict.values

  let deleteUserIdsPromise = sql => {
    let deleteUserIds =
      userRows
      ->Belt.Array.keepMap(userRow => userRow.dbOp == Types.Delete ? Some(userRow.entity) : None)
      ->Belt.Array.map(user => user.id)

    if deleteUserIds->Belt.Array.length > 0 {
      sql->DbFunctions.User.batchDeleteUser(deleteUserIds)
    } else {
      ()->Promise.resolve
    }
  }
  let setUserPromise = sql => {
    let setUser = userRows->Belt.Array.keepMap(userRow =>
      userRow.dbOp == Types.Set
        ? Some({
            ...userRow,
            entity: userRow.entity->Types.userEntity_encode,
          })
        : None
    )

    if setUser->Belt.Array.length > 0 {
      sql->DbFunctions.User.batchSetUser(setUser)
    } else {
      ()->Promise.resolve
    }
  }

  let tokenRows = InMemoryStore.Token.tokenDict.contents->Js.Dict.values

  let deleteTokenIdsPromise = sql => {
    let deleteTokenIds =
      tokenRows
      ->Belt.Array.keepMap(tokenRow => tokenRow.dbOp == Types.Delete ? Some(tokenRow.entity) : None)
      ->Belt.Array.map(token => token.id)

    if deleteTokenIds->Belt.Array.length > 0 {
      sql->DbFunctions.Token.batchDeleteToken(deleteTokenIds)
    } else {
      ()->Promise.resolve
    }
  }
  let setTokenPromise = sql => {
    let setToken = tokenRows->Belt.Array.keepMap(tokenRow =>
      tokenRow.dbOp == Types.Set
        ? Some({
            ...tokenRow,
            entity: tokenRow.entity->Types.tokenEntity_encode,
          })
        : None
    )

    if setToken->Belt.Array.length > 0 {
      sql->DbFunctions.Token.batchSetToken(setToken)
    } else {
      ()->Promise.resolve
    }
  }

  let metadataRows = InMemoryStore.Metadata.metadataDict.contents->Js.Dict.values

  let deleteMetadataIdsPromise = sql => {
    let deleteMetadataIds =
      metadataRows
      ->Belt.Array.keepMap(metadataRow =>
        metadataRow.dbOp == Types.Delete ? Some(metadataRow.entity) : None
      )
      ->Belt.Array.map(metadata => metadata.id)

    if deleteMetadataIds->Belt.Array.length > 0 {
      sql->DbFunctions.Metadata.batchDeleteMetadata(deleteMetadataIds)
    } else {
      ()->Promise.resolve
    }
  }
  let setMetadataPromise = sql => {
    let setMetadata = metadataRows->Belt.Array.keepMap(metadataRow =>
      metadataRow.dbOp == Types.Set
        ? Some({
            ...metadataRow,
            entity: metadataRow.entity->Types.metadataEntity_encode,
          })
        : None
    )

    if setMetadata->Belt.Array.length > 0 {
      sql->DbFunctions.Metadata.batchSetMetadata(setMetadata)
    } else {
      ()->Promise.resolve
    }
  }

  let attributeRows = InMemoryStore.Attribute.attributeDict.contents->Js.Dict.values

  let deleteAttributeIdsPromise = sql => {
    let deleteAttributeIds =
      attributeRows
      ->Belt.Array.keepMap(attributeRow =>
        attributeRow.dbOp == Types.Delete ? Some(attributeRow.entity) : None
      )
      ->Belt.Array.map(attribute => attribute.id)

    if deleteAttributeIds->Belt.Array.length > 0 {
      sql->DbFunctions.Attribute.batchDeleteAttribute(deleteAttributeIds)
    } else {
      ()->Promise.resolve
    }
  }
  let setAttributePromise = sql => {
    let setAttribute = attributeRows->Belt.Array.keepMap(attributeRow =>
      attributeRow.dbOp == Types.Set
        ? Some({
            ...attributeRow,
            entity: attributeRow.entity->Types.attributeEntity_encode,
          })
        : None
    )

    if setAttribute->Belt.Array.length > 0 {
      sql->DbFunctions.Attribute.batchSetAttribute(setAttribute)
    } else {
      ()->Promise.resolve
    }
  }

  let res = await sql->Postgres.beginSql(sql => {
    [
      sql->setRawEventsPromise,
      // sql->deleteDynamicContractRegistryIdsPromise, // NOTE: currently deleting dynamic contracts in unimplemented
      sql->setDynamicContractRegistryPromise,
      sql->deleteNftcollectionIdsPromise,
      sql->setNftcollectionPromise,
      sql->deleteUserIdsPromise,
      sql->setUserPromise,
      sql->deleteTokenIdsPromise,
      sql->setTokenPromise,
      sql->deleteMetadataIdsPromise,
      sql->setMetadataPromise,
      sql->deleteAttributeIdsPromise,
      sql->setAttributePromise,
    ]
  })

  res
}
