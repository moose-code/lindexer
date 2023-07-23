import { gql } from "./__generated__";

export const HASURA_URL = "http://104.248.33.65:8088/v1/graphql";

export const GET_NFT_COLLECTIONS = gql(`
  query GetNftCollections {
    nftcollection {
      id
      contractAddress
      name
      maxSupply
      currentSupply
    }
  }
`);

export const GET_NFTS_AT_COLLECTION_WITH_TOKENS = gql(`
  query GetNftsWithCollectionId($collectionId: String!, $limit: Int!, $skip: Int!) {
    token(where: {collection: {_eq: $collectionId}}, limit: $limit, offset: $skip, order_by: {tokenId: asc}) {
        id
        collection
        owner
        tokenId
        metadataMap {
        name
        description
        image
        attributesMap {
          trait_type
          value
          }
        }
    }

    token_aggregate(where: {collection: {_eq: $collectionId}}) {
      aggregate {
        count
      }
    }
  }
`);

export const GET_COLLECTION_WITH_TOKENS = gql(`
  query GetCollectionWithTokens($collectionId: String!, $limit: Int!, $skip: Int!) {
    nftcollection(where: {contractAddress: {_eq: $collectionId}}) {
      name
      currentSupply
      maxSupply
      contractAddress
      tokensMap(where: {collection: {_eq: $collectionId}}, limit: $limit, offset: $skip, order_by: {tokenId: asc}) {
          id
          collection
          owner
          tokenId
          metadataMap {
          name
          description
          image
          attributesMap {
            trait_type
            value
            }
          }
      }
    }

    token_aggregate(where: {collection: {_eq: $collectionId}}) {
      aggregate {
        count
      }
    }
  }
`);
