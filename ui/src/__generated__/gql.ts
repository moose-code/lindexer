/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetNftCollections {\n    nftcollection {\n      id\n      contractAddress\n      name\n      maxSupply\n      currentSupply\n    }\n  }\n":
        types.GetNftCollectionsDocument,
    "\n  query GetNftsWithCollectionId($collectionId: String!, $limit: Int!, $skip: Int!) {\n    token(where: {collection: {_eq: $collectionId}}, limit: $limit, offset: $skip, order_by: {tokenId: asc}) {\n        id\n        collection\n        owner\n        tokenId\n        metadataMap {\n        name\n        description\n        image\n        attributesMap {\n          trait_type\n          value\n          }\n        }\n    }\n\n    token_aggregate(where: {collection: {_eq: $collectionId}}) {\n      aggregate {\n        count\n      }\n    }\n  }\n":
        types.GetNftsWithCollectionIdDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n  query GetNftCollections {\n    nftcollection {\n      id\n      contractAddress\n      name\n      maxSupply\n      currentSupply\n    }\n  }\n"
): (typeof documents)["\n  query GetNftCollections {\n    nftcollection {\n      id\n      contractAddress\n      name\n      maxSupply\n      currentSupply\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n  query GetNftsWithCollectionId($collectionId: String!, $limit: Int!, $skip: Int!) {\n    token(where: {collection: {_eq: $collectionId}}, limit: $limit, offset: $skip, order_by: {tokenId: asc}) {\n        id\n        collection\n        owner\n        tokenId\n        metadataMap {\n        name\n        description\n        image\n        attributesMap {\n          trait_type\n          value\n          }\n        }\n    }\n\n    token_aggregate(where: {collection: {_eq: $collectionId}}) {\n      aggregate {\n        count\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetNftsWithCollectionId($collectionId: String!, $limit: Int!, $skip: Int!) {\n    token(where: {collection: {_eq: $collectionId}}, limit: $limit, offset: $skip, order_by: {tokenId: asc}) {\n        id\n        collection\n        owner\n        tokenId\n        metadataMap {\n        name\n        description\n        image\n        attributesMap {\n          trait_type\n          value\n          }\n        }\n    }\n\n    token_aggregate(where: {collection: {_eq: $collectionId}}) {\n      aggregate {\n        count\n      }\n    }\n  }\n"];

export function gql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
