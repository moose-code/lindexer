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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const provider = new ethers_1.ethers.JsonRpcProvider(`https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
// name
// symbol
// max supply
function fetchNFTMetadata(contractAddress, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.ethers.Contract(contractAddress, ["function tokenURI(uint256 tokenId) external view returns (string)"], provider);
        const tokenURI = yield contract.tokenURI(tokenId);
        console.log(tokenURI);
        //   const { data } = await axios.get(tokenURI);
        //   console.log(data);
    });
}
const contractAddress = "0xB62C414ABf83c0107DB84f8dE1c88631C05A8D7B";
const tokenId = "2";
fetchNFTMetadata(contractAddress, tokenId);
