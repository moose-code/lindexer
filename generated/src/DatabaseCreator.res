%raw("require('isomorphic-fetch')")

type t
@module external process: t = "process"

@send external exit: (t, unit) => unit = "exit"

%%private(let envSafe = EnvSafe.make())
let operatorUrl =
  envSafe->EnvSafe.get(
    ~name="ENVIO_OPERATOR_URL",
    ~struct=S.string(),
    ~devFallback="svc/envio-operator",
    (),
  )
let operatorPort =
  envSafe->EnvSafe.get(
    ~name="ENVIO_OPERATOR_PORT",
    ~struct=S.int()->S.Int.port(),
    ~devFallback=8081,
    (),
  )
let commitHash =
  envSafe->EnvSafe.get(~name="COMMIT_HASH", ~struct=S.string(), ~devFallback="latest", ())
let createDatabase = async () => {
  open Fetch
  // TODO: add the orginisation/user ID to this to allow multiple people to have the same project name and avoid confusion!
  let databaseName = `ercindexer${commitHash}`
  let response = await fetch(
    `${operatorUrl}:${operatorPort->Belt.Int.toString}/databases`,
    {
      method: #POST,
      body: `{"name": "${databaseName}"}`->Body.string,
      headers: Headers.fromObject({
        "Content-type": "application/json",
      }),
    },
  )
  let _ = await response->Response.json

  process->exit()
}