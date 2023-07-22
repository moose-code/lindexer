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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const provider = new ethers_1.ethers.JsonRpcProvider(`https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
function fetchNFTContractData(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.ethers.Contract(contractAddress, [
            "function name() external view returns (string)",
            "function symbol() external view returns (string)",
            "function totalSupply() external view returns (uint256)",
        ], provider);
        const name = yield contract.name();
        const symbol = yield contract.symbol();
        const totalSupply = yield contract.totalSupply();
        let contractData = {
            name: name,
            symbol: symbol,
            totalSupply: totalSupply.toString(),
        };
        // console.log(contractData);
        return contractData;
    });
}
function fetchNFTMetadata(contractAddress, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.ethers.Contract(contractAddress, ["function tokenURI(uint256 tokenId) external view returns (string)"], provider);
        let tokenURI = yield contract.tokenURI(tokenId);
        if (tokenURI.startsWith("ipfs://")) {
            tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        const { data } = yield axios_1.default.get(tokenURI);
        // console.log(data);
        return data;
    });
}
const contractAddress = "0xB62C414ABf83c0107DB84f8dE1c88631C05A8D7B";
const tokenId = "2";
fetchNFTMetadata(contractAddress, tokenId);
fetchNFTContractData(contractAddress);
