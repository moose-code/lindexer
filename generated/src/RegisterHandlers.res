let registerERC721Handlers = () => {
  try {
    let _ = %raw(`require("../../src/EventHandlers.bs.js")`)
  } catch {
  | _ =>
    Logging.error(
      "Unable to import the handler file for ERC721. Expected a file at ../../src/EventHandlers.bs.js, make sure this file is parsing as well",
    )
  }
}

let registerAllHandlers = () => {
  registerERC721Handlers()
}
