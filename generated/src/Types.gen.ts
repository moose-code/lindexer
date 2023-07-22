/* TypeScript file generated from Types.res by genType. */
/* eslint-disable import/first */


import type {BigInt_t as Ethers_BigInt_t} from '../src/bindings/Ethers.gen';

import type {ethAddress as Ethers_ethAddress} from '../src/bindings/Ethers.gen';

import type {userLogger as Logs_userLogger} from './Logs.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;
export type Id = id;

// tslint:disable-next-line:interface-over-type-literal
export type nftcollectionLoaderConfig = boolean;

// tslint:disable-next-line:interface-over-type-literal
export type userLoaderConfig = boolean;

// tslint:disable-next-line:interface-over-type-literal
export type tokenLoaderConfig = { readonly loadCollection?: nftcollectionLoaderConfig; readonly loadOwner?: userLoaderConfig };

// tslint:disable-next-line:interface-over-type-literal
export type nftcollectionEntity = {
  readonly id: string; 
  readonly contractAddress: string; 
  readonly name?: string; 
  readonly symbol?: string; 
  readonly maxSupply?: Ethers_BigInt_t; 
  readonly currentSupply: number
};

// tslint:disable-next-line:interface-over-type-literal
export type userEntity = { readonly id: string };

// tslint:disable-next-line:interface-over-type-literal
export type tokenEntity = {
  readonly id: string; 
  readonly tokenId: Ethers_BigInt_t; 
  readonly collection: id; 
  readonly owner: id
};

// tslint:disable-next-line:interface-over-type-literal
export type metadataEntity = {
  readonly id: string; 
  readonly tokenId: Ethers_BigInt_t; 
  readonly name: string; 
  readonly description: string; 
  readonly image: string
};

// tslint:disable-next-line:interface-over-type-literal
export type attributeEntity = {
  readonly id: string; 
  readonly tokenId: Ethers_BigInt_t; 
  readonly trait_type: string; 
  readonly value: string
};

// tslint:disable-next-line:interface-over-type-literal
export type eventLog<a> = {
  readonly params: a; 
  readonly blockNumber: number; 
  readonly blockTimestamp: number; 
  readonly blockHash: string; 
  readonly srcAddress: Ethers_ethAddress; 
  readonly transactionHash: string; 
  readonly transactionIndex: number; 
  readonly logIndex: number
};

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_eventArgs = {
  readonly from: Ethers_ethAddress; 
  readonly to: Ethers_ethAddress; 
  readonly tokenId: Ethers_BigInt_t
};

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_nftcollectionEntityHandlerContext = {
  readonly nftCollectionUpdated: () => (undefined | nftcollectionEntity); 
  readonly set: (_1:nftcollectionEntity) => void; 
  readonly delete: (_1:id) => void
};

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_userEntityHandlerContext = { readonly set: (_1:userEntity) => void; readonly delete: (_1:id) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_tokenEntityHandlerContext = {
  readonly existingTransferredToken: () => (undefined | tokenEntity); 
  readonly getCollection: (_1:tokenEntity) => nftcollectionEntity; 
  readonly getOwner: (_1:tokenEntity) => userEntity; 
  readonly set: (_1:tokenEntity) => void; 
  readonly delete: (_1:id) => void
};

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_metadataEntityHandlerContext = { readonly set: (_1:metadataEntity) => void; readonly delete: (_1:id) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_attributeEntityHandlerContext = { readonly set: (_1:attributeEntity) => void; readonly delete: (_1:id) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_context = {
  readonly log: Logs_userLogger; 
  readonly nftcollection: ERC721Contract_TransferEvent_nftcollectionEntityHandlerContext; 
  readonly user: ERC721Contract_TransferEvent_userEntityHandlerContext; 
  readonly token: ERC721Contract_TransferEvent_tokenEntityHandlerContext; 
  readonly metadata: ERC721Contract_TransferEvent_metadataEntityHandlerContext; 
  readonly attribute: ERC721Contract_TransferEvent_attributeEntityHandlerContext
};

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_nftcollectionEntityLoaderContext = { readonly nftCollectionUpdatedLoad: (_1:id) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_tokenEntityLoaderContext = { readonly existingTransferredTokenLoad: (_1:id, _2:{ readonly loaders?: tokenLoaderConfig }) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_contractRegistrations = { readonly addERC721: (_1:Ethers_ethAddress) => void };

// tslint:disable-next-line:interface-over-type-literal
export type ERC721Contract_TransferEvent_loaderContext = {
  readonly contractRegistration: ERC721Contract_TransferEvent_contractRegistrations; 
  readonly nftcollection: ERC721Contract_TransferEvent_nftcollectionEntityLoaderContext; 
  readonly token: ERC721Contract_TransferEvent_tokenEntityLoaderContext
};
