%%raw("require('isomorphic-fetch')")
open Fetch

%%private(let envSafe = EnvSafe.make())

let hasuraGraphqlEndpoint = EnvUtils.getStringEnvVar(
  ~envSafe,
  ~fallback="http://localhost:8080/v1/metadata",
  "HASURA_GRAPHQL_ENDPOINT",
)

let hasuraRole = EnvUtils.getStringEnvVar(~envSafe, ~fallback="admin", "HASURA_GRAPHQL_ROLE")

let hasuraSecret = EnvUtils.getStringEnvVar(
  ~envSafe,
  ~fallback="testing",
  "HASURA_GRAPHQL_ADMIN_SECRET",
)

let headers = {
  "Content-Type": "application/json",
  "X-Hasura-Role": hasuraRole,
  "X-Hasura-Admin-Secret": hasuraSecret,
}

let trackTable = async (~tableName: string) => {
  let body = {
    "type": "pg_track_table",
    "args": {
      "source": "public",
      "schema": "public",
      "name": tableName,
    },
  }

  let response = await fetch(
    hasuraGraphqlEndpoint,
    {
      method: #POST,
      body: body->Js.Json.stringifyAny->Belt.Option.getExn->Body.string,
      headers: Headers.fromObject(headers),
    },
  )

  let responseJson = await response->Response.json
  let statusCode = response->Response.status

  Logging.trace({
    "msg": "Table Tracked",
    "tableName": tableName,
    "requestStatusCode": statusCode,
    "requestResponseJson": responseJson,
  })
}

let createSelectPermissions = async (~tableName: string) => {
  let body = {
    "type": "pg_create_select_permission",
    "args": {
      "table": tableName,
      "role": "public",
      "source": "default",
      "permission": {
        "columns": "*",
        "filter": Js.Obj.empty(),
      },
    },
  }

  let response = await fetch(
    hasuraGraphqlEndpoint,
    {
      method: #POST,
      body: body->Js.Json.stringifyAny->Belt.Option.getExn->Body.string,
      headers: Headers.fromObject(headers),
    },
  )

  let responseJson = await response->Response.json
  let statusCode = response->Response.status

  Logging.trace({
    "msg": "Hasura select permissions created",
    "tableName": tableName,
    "requestStatusCode": statusCode,
    "requestResponseJson": responseJson,
  })
}

let createEntityRelationship = async (
  ~tableName: string,
  ~relationshipType: string,
  ~relationalKey: string,
  ~mappedEntity: string,
  ~derivedFromFieldKey: string,
) => {
  let derivedFromTo =
    derivedFromFieldKey != ""
      ? `"id": "${derivedFromFieldKey->Js.String.toLowerCase}"`
      : `"${relationalKey}" : "id"`

  let bodyString = `{"type": "pg_create_${relationshipType}_relationship","args": {"table": "${tableName}","name": "${relationalKey}Map","source": "default","using": {"manual_configuration": {"remote_table": "${mappedEntity}","column_mapping": {${derivedFromTo}}}}}}`

  let response = await fetch(
    hasuraGraphqlEndpoint,
    {
      method: #POST,
      body: bodyString->Body.string,
      headers: Headers.fromObject(headers),
    },
  )

  let responseJson = await response->Response.json
  let statusCode = response->Response.status

  Logging.trace({
    "msg": "Hasura derived field permissions created",
    "tableName": tableName,
    "requestStatusCode": statusCode,
    "requestResponseJson": responseJson,
  })
}

let trackAllTables = async () => {
  let _ = await trackTable(~tableName="raw_events")
  let _ = await createSelectPermissions(~tableName="raw_events")
  let _ = await trackTable(~tableName="dynamic_contract_registry")
  let _ = await createSelectPermissions(~tableName="dynamic_contract_registry")
  let _ = await trackTable(~tableName="nftcollection")
  let _ = await createSelectPermissions(~tableName="nftcollection")
  let _ = await trackTable(~tableName="user")
  let _ = await createSelectPermissions(~tableName="user")
  let _ = await trackTable(~tableName="token")
  let _ = await createSelectPermissions(~tableName="token")
  let _ = await createEntityRelationship(
    ~tableName="user",
    ~relationshipType="array",
    ~relationalKey="tokens",
    ~mappedEntity="token",
    ~derivedFromFieldKey="owner",
  )
  let _ = await createEntityRelationship(
    ~tableName="token",
    ~relationshipType="object",
    ~relationalKey="collection",
    ~mappedEntity="nftcollection",
    ~derivedFromFieldKey="",
  )
  let _ = await createEntityRelationship(
    ~tableName="token",
    ~relationshipType="object",
    ~relationalKey="owner",
    ~mappedEntity="user",
    ~derivedFromFieldKey="",
  )
}
