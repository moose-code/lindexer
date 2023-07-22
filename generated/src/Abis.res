/* Hello world from test */
let eRC721Abi = `
    [{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true},{"name":"to","type":"address","indexed":true},{"name":"tokenId","type":"uint256","indexed":true}],"anonymous":false}]
    `->Js.Json.parseExn
