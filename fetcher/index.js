"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
const pg_promise_1 = __importDefault(require("pg-promise"));
const fs_1 = require("fs");
const yaml_1 = require("yaml");
(0, dotenv_1.config)();
const provider = new ethers_1.ethers.JsonRpcProvider(`https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
// Database setup
const DATABASE_URI = process.env.DATABASE_URI ||
    "postgresql://postgres:testing@localhost:5432/envio-dev";
const pgp = (0, pg_promise_1.default)();
const db = pgp(DATABASE_URI);
const configFile = (0, fs_1.readFileSync)("../config.yaml", "utf8");
const con = (0, yaml_1.parse)(configFile);
const nftDataList = con.networks.flatMap((network) => network.contracts.flatMap((contract) => contract.address.map((address) => ({
    id: address,
}))));
function updateNFTData(nftData) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.ethers.Contract(nftData.id, [
            "function name() external view returns (string)",
            "function symbol() external view returns (string)",
            "function totalSupply() external view returns (uint256)",
        ], provider);
        const name = yield contract.name();
        const symbol = yield contract.symbol();
        const totalSupply = yield contract.totalSupply();
        // Update nftData with the information fetched
        nftData.name = name;
        nftData.symbol = symbol;
        nftData.maxSupply = totalSupply.toString();
        // Update data in the database
        return db
            .none(`UPDATE nftcollection SET 
      "name" = $1, 
      "symbol" = $2, 
      "maxSupply" = $3 
    WHERE "id" = $4`, [nftData.name, nftData.symbol, nftData.maxSupply, nftData.id])
            .catch((error) => {
            console.error(`Error updating data for the contract ID: ${nftData.id}`, error);
        });
    });
}
// Fetch data and update nftData with it, then update the database.
// This occurs in parrallel.
Promise.all(nftDataList.map(updateNFTData))
    .then(() => {
    console.log("All data updated successfully");
})
    .catch((error) => {
    console.error("Error updating data", error);
});
// async function fetchNFTContractData(contractAddress: string): Promise<any> {
//   const contract = new ethers.Contract(
//     contractAddress,
//     [
//       "function name() external view returns (string)",
//       "function symbol() external view returns (string)",
//       "function totalSupply() external view returns (uint256)",
//     ],
//     provider
//   );
//   const name = await contract.name();
//   const symbol = await contract.symbol();
//   const totalSupply = await contract.totalSupply();
//   let contractData = {
//     name: name,
//     symbol: symbol,
//     totalSupply: totalSupply.toString(),
//   };
//   // console.log(contractData);
//   return contractData;
// }
// async function fetchNFTMetadata(
//   contractAddress: string,
//   tokenId: string
// ): Promise<any> {
//   const contract = new ethers.Contract(
//     contractAddress,
//     ["function tokenURI(uint256 tokenId) external view returns (string)"],
//     provider
//   );
//   let tokenURI = await contract.tokenURI(tokenId);
//   if (tokenURI.startsWith("ipfs://")) {
//     tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
//   }
//   const { data } = await axios.get(tokenURI);
//   return data;
// }
