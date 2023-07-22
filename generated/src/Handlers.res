type functionRegister = Loader | Handler

let mapFunctionRegisterName = (functionRegister: functionRegister) => {
  switch functionRegister {
  | Loader => "Loader"
  | Handler => "Handler"
  }
}

let getDefaultLoaderHandler: (
  ~functionRegister: functionRegister,
  ~eventName: string,
  ~event: 'a,
  ~context: 'b,
) => unit = (~functionRegister, ~eventName, ~event as _, ~context as _) => {
  let functionName = mapFunctionRegisterName(functionRegister)
  Js.Console.warn(
    // TODO: link to our docs.
    `Ignored ${eventName} event, as there is no ${functionName} registered. You need to implement a ${eventName}${functionName} method in your handler file.`,
  )
}

module ERC721Contract = {
  module Transfer = {
    %%private(
      let transferLoader = ref(None)
      let transferHandler = ref(None)
    )

    @genType
    let loader = (
      userLoader: (
        ~event: Types.eventLog<Types.ERC721Contract.TransferEvent.eventArgs>,
        ~context: Types.ERC721Contract.TransferEvent.loaderContext,
      ) => unit,
    ) => {
      transferLoader := Some(userLoader)
    }

    @genType
    let handler = (
      userHandler: (
        ~event: Types.eventLog<Types.ERC721Contract.TransferEvent.eventArgs>,
        ~context: Types.ERC721Contract.TransferEvent.context,
      ) => unit,
    ) => {
      transferHandler := Some(userHandler)
    }

    let getLoader = () =>
      transferLoader.contents->Belt.Option.getWithDefault(
        getDefaultLoaderHandler(~eventName="Transfer", ~functionRegister=Loader),
      )

    let getHandler = () =>
      transferHandler.contents->Belt.Option.getWithDefault(
        getDefaultLoaderHandler(~eventName="Transfer", ~functionRegister=Handler),
      )
  }
}
