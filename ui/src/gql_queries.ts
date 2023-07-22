import { gql } from "./__generated__";

export const HASURA_URL = "http://localhost:8080/v1/graphql";

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

export const GET_NFTS_AT_COLLECTION_ID = gql(`
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
