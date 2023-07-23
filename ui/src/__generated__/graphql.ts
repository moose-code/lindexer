/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  contract_type: { input: any; output: any; }
  event_type: { input: any; output: any; }
  json: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamp: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "attribute" */
export type Attribute = {
  __typename?: 'attribute';
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id: Scalars['Int']['output'];
  event_id: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  metadata_id: Scalars['String']['output'];
  trait_type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** order by aggregate values of table "attribute" */
export type Attribute_Aggregate_Order_By = {
  avg?: InputMaybe<Attribute_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Attribute_Max_Order_By>;
  min?: InputMaybe<Attribute_Min_Order_By>;
  stddev?: InputMaybe<Attribute_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Attribute_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Attribute_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Attribute_Sum_Order_By>;
  var_pop?: InputMaybe<Attribute_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Attribute_Var_Samp_Order_By>;
  variance?: InputMaybe<Attribute_Variance_Order_By>;
};

/** order by avg() on columns of table "attribute" */
export type Attribute_Avg_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "attribute". All fields are combined with a logical 'AND'. */
export type Attribute_Bool_Exp = {
  _and?: InputMaybe<Array<Attribute_Bool_Exp>>;
  _not?: InputMaybe<Attribute_Bool_Exp>;
  _or?: InputMaybe<Array<Attribute_Bool_Exp>>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_chain_id?: InputMaybe<Int_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  metadata_id?: InputMaybe<String_Comparison_Exp>;
  trait_type?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "attribute" */
export type Attribute_Max_Order_By = {
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_id?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "attribute" */
export type Attribute_Min_Order_By = {
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_id?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "attribute". */
export type Attribute_Order_By = {
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_id?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** select columns of table "attribute" */
export enum Attribute_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventChainId = 'event_chain_id',
  /** column name */
  EventId = 'event_id',
  /** column name */
  Id = 'id',
  /** column name */
  MetadataId = 'metadata_id',
  /** column name */
  TraitType = 'trait_type',
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "attribute" */
export type Attribute_Stddev_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "attribute" */
export type Attribute_Stddev_Pop_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "attribute" */
export type Attribute_Stddev_Samp_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "attribute" */
export type Attribute_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Attribute_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Attribute_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_chain_id?: InputMaybe<Scalars['Int']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata_id?: InputMaybe<Scalars['String']['input']>;
  trait_type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "attribute" */
export type Attribute_Sum_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "attribute" */
export type Attribute_Var_Pop_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "attribute" */
export type Attribute_Var_Samp_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "attribute" */
export type Attribute_Variance_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "contract_type". All fields are combined with logical 'AND'. */
export type Contract_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['contract_type']['input']>;
  _gt?: InputMaybe<Scalars['contract_type']['input']>;
  _gte?: InputMaybe<Scalars['contract_type']['input']>;
  _in?: InputMaybe<Array<Scalars['contract_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['contract_type']['input']>;
  _lte?: InputMaybe<Scalars['contract_type']['input']>;
  _neq?: InputMaybe<Scalars['contract_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['contract_type']['input']>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "dynamic_contract_registry" */
export type Dynamic_Contract_Registry = {
  __typename?: 'dynamic_contract_registry';
  chain_id: Scalars['Int']['output'];
  contract_address: Scalars['String']['output'];
  contract_type: Scalars['contract_type']['output'];
  event_id: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "dynamic_contract_registry". All fields are combined with a logical 'AND'. */
export type Dynamic_Contract_Registry_Bool_Exp = {
  _and?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>;
  _not?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
  _or?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  contract_type?: InputMaybe<Contract_Type_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "dynamic_contract_registry". */
export type Dynamic_Contract_Registry_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_type?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
};

/** select columns of table "dynamic_contract_registry" */
export enum Dynamic_Contract_Registry_Select_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  EventId = 'event_id'
}

/** Streaming cursor of the table "dynamic_contract_registry" */
export type Dynamic_Contract_Registry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dynamic_Contract_Registry_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dynamic_Contract_Registry_Stream_Cursor_Value_Input = {
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['contract_type']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
};

/** Boolean expression to compare columns of type "event_type". All fields are combined with logical 'AND'. */
export type Event_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['event_type']['input']>;
  _gt?: InputMaybe<Scalars['event_type']['input']>;
  _gte?: InputMaybe<Scalars['event_type']['input']>;
  _in?: InputMaybe<Array<Scalars['event_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['event_type']['input']>;
  _lte?: InputMaybe<Scalars['event_type']['input']>;
  _neq?: InputMaybe<Scalars['event_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['event_type']['input']>>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

/** columns and relationships of "metadata" */
export type Metadata = {
  __typename?: 'metadata';
  /** An array relationship */
  attributesMap: Array<Attribute>;
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  description: Scalars['String']['output'];
  event_chain_id: Scalars['Int']['output'];
  event_id: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  token_id: Scalars['String']['output'];
};


/** columns and relationships of "metadata" */
export type MetadataAttributesMapArgs = {
  distinct_on?: InputMaybe<Array<Attribute_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attribute_Order_By>>;
  where?: InputMaybe<Attribute_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "metadata". All fields are combined with a logical 'AND'. */
export type Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Metadata_Bool_Exp>>;
  _not?: InputMaybe<Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Metadata_Bool_Exp>>;
  attributesMap?: InputMaybe<Attribute_Bool_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  event_chain_id?: InputMaybe<Int_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  image?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  token_id?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "metadata". */
export type Metadata_Order_By = {
  attributesMap_aggregate?: InputMaybe<Attribute_Aggregate_Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
};

/** select columns of table "metadata" */
export enum Metadata_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Description = 'description',
  /** column name */
  EventChainId = 'event_chain_id',
  /** column name */
  EventId = 'event_id',
  /** column name */
  Id = 'id',
  /** column name */
  Image = 'image',
  /** column name */
  Name = 'name',
  /** column name */
  TokenId = 'token_id'
}

/** Streaming cursor of the table "metadata" */
export type Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metadata_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  event_chain_id?: InputMaybe<Scalars['Int']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "nftcollection" */
export type Nftcollection = {
  __typename?: 'nftcollection';
  contractAddress: Scalars['String']['output'];
  currentSupply: Scalars['Int']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id: Scalars['Int']['output'];
  event_id: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  maxSupply?: Maybe<Scalars['numeric']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

/** Boolean expression to filter rows from the table "nftcollection". All fields are combined with a logical 'AND'. */
export type Nftcollection_Bool_Exp = {
  _and?: InputMaybe<Array<Nftcollection_Bool_Exp>>;
  _not?: InputMaybe<Nftcollection_Bool_Exp>;
  _or?: InputMaybe<Array<Nftcollection_Bool_Exp>>;
  contractAddress?: InputMaybe<String_Comparison_Exp>;
  currentSupply?: InputMaybe<Int_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_chain_id?: InputMaybe<Int_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  maxSupply?: InputMaybe<Numeric_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  symbol?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "nftcollection". */
export type Nftcollection_Order_By = {
  contractAddress?: InputMaybe<Order_By>;
  currentSupply?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  maxSupply?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
};

/** select columns of table "nftcollection" */
export enum Nftcollection_Select_Column {
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CurrentSupply = 'currentSupply',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventChainId = 'event_chain_id',
  /** column name */
  EventId = 'event_id',
  /** column name */
  Id = 'id',
  /** column name */
  MaxSupply = 'maxSupply',
  /** column name */
  Name = 'name',
  /** column name */
  Symbol = 'symbol'
}

/** Streaming cursor of the table "nftcollection" */
export type Nftcollection_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Nftcollection_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Nftcollection_Stream_Cursor_Value_Input = {
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  currentSupply?: InputMaybe<Scalars['Int']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_chain_id?: InputMaybe<Scalars['Int']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  maxSupply?: InputMaybe<Scalars['numeric']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "attribute" */
  attribute: Array<Attribute>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table: "nftcollection" */
  nftcollection: Array<Nftcollection>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
  /** fetch data from the table: "token" */
  token: Array<Token>;
  /** fetch aggregated fields from the table: "token" */
  token_aggregate: Token_Aggregate;
  /** fetch data from the table: "user" */
  user: Array<User>;
};


export type Query_RootAttributeArgs = {
  distinct_on?: InputMaybe<Array<Attribute_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attribute_Order_By>>;
  where?: InputMaybe<Attribute_Bool_Exp>;
};


export type Query_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Query_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  contract_address: Scalars['String']['input'];
};


export type Query_RootMetadataArgs = {
  distinct_on?: InputMaybe<Array<Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metadata_Order_By>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};


export type Query_RootNftcollectionArgs = {
  distinct_on?: InputMaybe<Array<Nftcollection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nftcollection_Order_By>>;
  where?: InputMaybe<Nftcollection_Bool_Exp>;
};


export type Query_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Query_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  event_id: Scalars['numeric']['input'];
};


export type Query_RootTokenArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Query_RootToken_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** columns and relationships of "raw_events" */
export type Raw_Events = {
  __typename?: 'raw_events';
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_id: Scalars['numeric']['output'];
  event_type: Scalars['event_type']['output'];
  log_index: Scalars['Int']['output'];
  params: Scalars['json']['output'];
  src_address: Scalars['String']['output'];
  transaction_hash: Scalars['String']['output'];
  transaction_index: Scalars['Int']['output'];
};


/** columns and relationships of "raw_events" */
export type Raw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type Raw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  _not?: InputMaybe<Raw_Events_Bool_Exp>;
  _or?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  block_hash?: InputMaybe<String_Comparison_Exp>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  event_type?: InputMaybe<Event_Type_Comparison_Exp>;
  log_index?: InputMaybe<Int_Comparison_Exp>;
  params?: InputMaybe<Json_Comparison_Exp>;
  src_address?: InputMaybe<String_Comparison_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  transaction_index?: InputMaybe<Int_Comparison_Exp>;
};

/** Ordering options when selecting data from "raw_events". */
export type Raw_Events_Order_By = {
  block_hash?: InputMaybe<Order_By>;
  block_number?: InputMaybe<Order_By>;
  block_timestamp?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  event_type?: InputMaybe<Order_By>;
  log_index?: InputMaybe<Order_By>;
  params?: InputMaybe<Order_By>;
  src_address?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  transaction_index?: InputMaybe<Order_By>;
};

/** select columns of table "raw_events" */
export enum Raw_Events_Select_Column {
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventId = 'event_id',
  /** column name */
  EventType = 'event_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  SrcAddress = 'src_address',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransactionIndex = 'transaction_index'
}

/** Streaming cursor of the table "raw_events" */
export type Raw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Raw_Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Raw_Events_Stream_Cursor_Value_Input = {
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  event_type?: InputMaybe<Scalars['event_type']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['json']['input']>;
  src_address?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transaction_index?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "attribute" */
  attribute: Array<Attribute>;
  /** fetch data from the table in a streaming manner: "attribute" */
  attribute_stream: Array<Attribute>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>;
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table in a streaming manner: "metadata" */
  metadata_stream: Array<Metadata>;
  /** fetch data from the table: "nftcollection" */
  nftcollection: Array<Nftcollection>;
  /** fetch data from the table in a streaming manner: "nftcollection" */
  nftcollection_stream: Array<Nftcollection>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<Raw_Events>;
  /** fetch data from the table: "token" */
  token: Array<Token>;
  /** fetch aggregated fields from the table: "token" */
  token_aggregate: Token_Aggregate;
  /** fetch data from the table in a streaming manner: "token" */
  token_stream: Array<Token>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
};


export type Subscription_RootAttributeArgs = {
  distinct_on?: InputMaybe<Array<Attribute_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attribute_Order_By>>;
  where?: InputMaybe<Attribute_Bool_Exp>;
};


export type Subscription_RootAttribute_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Attribute_Stream_Cursor_Input>>;
  where?: InputMaybe<Attribute_Bool_Exp>;
};


export type Subscription_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Subscription_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  contract_address: Scalars['String']['input'];
};


export type Subscription_RootDynamic_Contract_Registry_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dynamic_Contract_Registry_Stream_Cursor_Input>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Subscription_RootMetadataArgs = {
  distinct_on?: InputMaybe<Array<Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metadata_Order_By>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};


export type Subscription_RootMetadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};


export type Subscription_RootNftcollectionArgs = {
  distinct_on?: InputMaybe<Array<Nftcollection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nftcollection_Order_By>>;
  where?: InputMaybe<Nftcollection_Bool_Exp>;
};


export type Subscription_RootNftcollection_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Nftcollection_Stream_Cursor_Input>>;
  where?: InputMaybe<Nftcollection_Bool_Exp>;
};


export type Subscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Subscription_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  event_id: Scalars['numeric']['input'];
};


export type Subscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Raw_Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Subscription_RootTokenArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Subscription_RootToken_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Subscription_RootToken_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Token_Stream_Cursor_Input>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** columns and relationships of "token" */
export type Token = {
  __typename?: 'token';
  collection: Scalars['String']['output'];
  /** An object relationship */
  collectionMap?: Maybe<Nftcollection>;
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id: Scalars['Int']['output'];
  event_id: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  /** An object relationship */
  metadataMap?: Maybe<Metadata>;
  owner: Scalars['String']['output'];
  /** An object relationship */
  ownerMap?: Maybe<User>;
  tokenId: Scalars['numeric']['output'];
};

/** aggregated selection of "token" */
export type Token_Aggregate = {
  __typename?: 'token_aggregate';
  aggregate?: Maybe<Token_Aggregate_Fields>;
  nodes: Array<Token>;
};

export type Token_Aggregate_Bool_Exp = {
  count?: InputMaybe<Token_Aggregate_Bool_Exp_Count>;
};

export type Token_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Token_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "token" */
export type Token_Aggregate_Fields = {
  __typename?: 'token_aggregate_fields';
  avg?: Maybe<Token_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Token_Max_Fields>;
  min?: Maybe<Token_Min_Fields>;
  stddev?: Maybe<Token_Stddev_Fields>;
  stddev_pop?: Maybe<Token_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Token_Stddev_Samp_Fields>;
  sum?: Maybe<Token_Sum_Fields>;
  var_pop?: Maybe<Token_Var_Pop_Fields>;
  var_samp?: Maybe<Token_Var_Samp_Fields>;
  variance?: Maybe<Token_Variance_Fields>;
};


/** aggregate fields of "token" */
export type Token_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "token" */
export type Token_Aggregate_Order_By = {
  avg?: InputMaybe<Token_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Token_Max_Order_By>;
  min?: InputMaybe<Token_Min_Order_By>;
  stddev?: InputMaybe<Token_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Token_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Token_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Token_Sum_Order_By>;
  var_pop?: InputMaybe<Token_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Token_Var_Samp_Order_By>;
  variance?: InputMaybe<Token_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Token_Avg_Fields = {
  __typename?: 'token_avg_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "token" */
export type Token_Avg_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "token". All fields are combined with a logical 'AND'. */
export type Token_Bool_Exp = {
  _and?: InputMaybe<Array<Token_Bool_Exp>>;
  _not?: InputMaybe<Token_Bool_Exp>;
  _or?: InputMaybe<Array<Token_Bool_Exp>>;
  collection?: InputMaybe<String_Comparison_Exp>;
  collectionMap?: InputMaybe<Nftcollection_Bool_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_chain_id?: InputMaybe<Int_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  metadataMap?: InputMaybe<Metadata_Bool_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  ownerMap?: InputMaybe<User_Bool_Exp>;
  tokenId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Token_Max_Fields = {
  __typename?: 'token_max_fields';
  collection?: Maybe<Scalars['String']['output']>;
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id?: Maybe<Scalars['Int']['output']>;
  event_id?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "token" */
export type Token_Max_Order_By = {
  collection?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Token_Min_Fields = {
  __typename?: 'token_min_fields';
  collection?: Maybe<Scalars['String']['output']>;
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id?: Maybe<Scalars['Int']['output']>;
  event_id?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "token" */
export type Token_Min_Order_By = {
  collection?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "token". */
export type Token_Order_By = {
  collection?: InputMaybe<Order_By>;
  collectionMap?: InputMaybe<Nftcollection_Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadataMap?: InputMaybe<Metadata_Order_By>;
  owner?: InputMaybe<Order_By>;
  ownerMap?: InputMaybe<User_Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** select columns of table "token" */
export enum Token_Select_Column {
  /** column name */
  Collection = 'collection',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventChainId = 'event_chain_id',
  /** column name */
  EventId = 'event_id',
  /** column name */
  Id = 'id',
  /** column name */
  Owner = 'owner',
  /** column name */
  TokenId = 'tokenId'
}

/** aggregate stddev on columns */
export type Token_Stddev_Fields = {
  __typename?: 'token_stddev_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "token" */
export type Token_Stddev_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Token_Stddev_Pop_Fields = {
  __typename?: 'token_stddev_pop_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "token" */
export type Token_Stddev_Pop_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Token_Stddev_Samp_Fields = {
  __typename?: 'token_stddev_samp_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "token" */
export type Token_Stddev_Samp_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "token" */
export type Token_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Token_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Token_Stream_Cursor_Value_Input = {
  collection?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_chain_id?: InputMaybe<Scalars['Int']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Token_Sum_Fields = {
  __typename?: 'token_sum_fields';
  event_chain_id?: Maybe<Scalars['Int']['output']>;
  event_id?: Maybe<Scalars['numeric']['output']>;
  tokenId?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "token" */
export type Token_Sum_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Token_Var_Pop_Fields = {
  __typename?: 'token_var_pop_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "token" */
export type Token_Var_Pop_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Token_Var_Samp_Fields = {
  __typename?: 'token_var_samp_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "token" */
export type Token_Var_Samp_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Token_Variance_Fields = {
  __typename?: 'token_variance_fields';
  event_chain_id?: Maybe<Scalars['Float']['output']>;
  event_id?: Maybe<Scalars['Float']['output']>;
  tokenId?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "token" */
export type Token_Variance_Order_By = {
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_chain_id: Scalars['Int']['output'];
  event_id: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  /** An array relationship */
  tokensMap: Array<Token>;
  /** An aggregate relationship */
  tokensMap_aggregate: Token_Aggregate;
};


/** columns and relationships of "user" */
export type UserTokensMapArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserTokensMap_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_chain_id?: InputMaybe<Int_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  tokensMap?: InputMaybe<Token_Bool_Exp>;
  tokensMap_aggregate?: InputMaybe<Token_Aggregate_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  db_write_timestamp?: InputMaybe<Order_By>;
  event_chain_id?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokensMap_aggregate?: InputMaybe<Token_Aggregate_Order_By>;
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventChainId = 'event_chain_id',
  /** column name */
  EventId = 'event_id',
  /** column name */
  Id = 'id'
}

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_chain_id?: InputMaybe<Scalars['Int']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type GetNftCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNftCollectionsQuery = { __typename?: 'query_root', nftcollection: Array<{ __typename?: 'nftcollection', id: string, contractAddress: string, name?: string | null, maxSupply?: any | null, currentSupply: number }> };

export type GetNftsWithCollectionIdQueryVariables = Exact<{
  collectionId: Scalars['String']['input'];
}>;


export type GetNftsWithCollectionIdQuery = { __typename?: 'query_root', token: Array<{ __typename?: 'token', id: string, collection: string, owner: string, tokenId: any, metadataMap?: { __typename?: 'metadata', name: string, description: string, image: string, attributesMap: Array<{ __typename?: 'attribute', trait_type: string, value: string }> } | null }>, token_aggregate: { __typename?: 'token_aggregate', aggregate?: { __typename?: 'token_aggregate_fields', count: number } | null } };


export const GetNftCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNftCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nftcollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxSupply"}},{"kind":"Field","name":{"kind":"Name","value":"currentSupply"}}]}}]}}]} as unknown as DocumentNode<GetNftCollectionsQuery, GetNftCollectionsQueryVariables>;
export const GetNftsWithCollectionIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNftsWithCollectionId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collection"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"metadataMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"attributesMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trait_type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetNftsWithCollectionIdQuery, GetNftsWithCollectionIdQueryVariables>;