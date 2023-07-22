/* Hello world from test */
let eRC721Abi = `
    [{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":false},{"name":"to","type":"address","indexed":false},{"name":"tokenId","type":"uint256","indexed":false}],"anonymous":false}]
    `->Js.Json.parseExn
