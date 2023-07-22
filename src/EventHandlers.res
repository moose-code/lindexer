open Types

let zeroAddress = Ethers.getAddressFromStringUnsafe("0x0000000000000000000000000000000000000000")

Handlers.ERC721Contract.Transfer.loader((~event, ~context) => {
  context.user.userFromLoad(event.params.from->Ethers.ethAddressToString)
  context.user.userToLoad(event.params.to->Ethers.ethAddressToString)
  context.nftcollection.nftCollectionUpdatedLoad(event.srcAddress->Ethers.ethAddressToString)
  context.token.existingTransferredTokenLoad(
    event.srcAddress->Ethers.ethAddressToString ++ event.params.tokenId->Ethers.BigInt.toString,
    ~loaders={},
  )
})

Handlers.ERC721Contract.Transfer.handler((~event, ~context) => {
  let token = {
    id: event.srcAddress->Ethers.ethAddressToString ++ event.params.tokenId->Ethers.BigInt.toString,
    tokenId: event.params.tokenId,
    collection: event.srcAddress->Ethers.ethAddressToString,
    owner: event.params.to->Ethers.ethAddressToString,
  }

  switch context.nftcollection.nftCollectionUpdated() {
  | Some(nftCollectionUpdated) =>
    //Update NFT collections
    let optExistingToken = context.token.existingTransferredToken()

    if optExistingToken->Belt.Option.isNone {
      //Update token collection supply
      ()
    }
  | None => //TODO: Create NFT collection
    ()
  }->ignore

  if event.params.from !== zeroAddress {
    let optLoadedUserFrom = context.user.userFrom()
    let userFrom = {
      id: event.params.from->Ethers.ethAddressToString,
      address: event.params.from->Ethers.ethAddressToString,
    }
    context.user.set(userFrom)
  }
  //
  // if (event.params.to !== zeroAddress) {
  //   let loadedUserTo = context.user.userTo();
  //
  //   let userToTokensOpt: Array<string> = loadedUserTo?.tokens ?? [];
  //   let userToTokens: Array<string> = [token.id];
  //
  //   if (typeof userToTokensOpt !== "string") {
  //     userToTokens.concat(userToTokensOpt);
  //   }
  //
  //   let userTo = {
  //     id: event.params.to,
  //     address: event.params.to,
  //     tokens: userToTokens,
  //   };
  //   context.user.set(userTo);
  // }
  //
  // context.token.set(token);
})

/*
SimpleNftContract_Transfer_loader(({ event, context }) => {
  context.user.userFromLoad(event.params.from, { loaders: undefined });
  context.user.userToLoad(event.params.to, { loaders: undefined });
  context.nftcollection.nftCollectionUpdatedLoad(event.srcAddress);
  context.token.existingTransferredTokenLoad(
    event.srcAddress.concat("-").concat(event.params.tokenId.toString()), { loaders: undefined }
  );
});

SimpleNftContract_Transfer_handler(({ event, context }) => {
  let nftCollectionUpdated = context.nftcollection.nftCollectionUpdated();
  let token = {
    id: event.srcAddress.concat("-").concat(event.params.tokenId.toString()),
    tokenId: event.params.tokenId,
    collection: event.srcAddress,
    owner: event.params.to,
  };
  if (nftCollectionUpdated) {
    let existingToken = context.token.existingTransferredToken();
    if (!existingToken) {
      let currentSupply = Number(nftCollectionUpdated.currentSupply) + 1;

      let nftCollection: nftcollectionEntity = {
        ...nftCollectionUpdated,
        currentSupply,
      };
      context.nftcollection.set(nftCollection);
    }
  } else {
    console.log(
      "Issue with events emitted, unregistered NFT collection transfer"
    );
    return;
  }

  if (event.params.from !== zeroAddress) {
    let loadedUserFrom = context.user.userFrom();
    let userFromTokensOpt: Array<string> = loadedUserFrom?.tokens ?? [];
    let userFromTokens: Array<string> = [];
    if (typeof userFromTokensOpt !== "string") {
      userFromTokens.concat(userFromTokensOpt);
    }
    let index = userFromTokens.indexOf(token.id, 0);
    if (index > -1) {
      userFromTokens.splice(index, 1);
    }

    let userFrom = {
      id: event.params.from,
      address: event.params.from,
      tokens: userFromTokens,
    };
    context.user.set(userFrom);
  }

  if (event.params.to !== zeroAddress) {
    let loadedUserTo = context.user.userTo();

    let userToTokensOpt: Array<string> = loadedUserTo?.tokens ?? [];
    let userToTokens: Array<string> = [token.id];

    if (typeof userToTokensOpt !== "string") {
      userToTokens.concat(userToTokensOpt);
    }

    let userTo = {
      id: event.params.to,
      address: event.params.to,
      tokens: userToTokens,
    };
    context.user.set(userTo);
  }

  context.token.set(token);
});
*/
