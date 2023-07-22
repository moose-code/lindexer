import { ethers } from "ethers";
import axios from "axios";
import { config } from "dotenv";
config();

const provider = new ethers.JsonRpcProvider(
  `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
);

async function fetchNFTContractData(contractAddress: string): Promise<any> {
  const contract = new ethers.Contract(
    contractAddress,
    [
      "function name() external view returns (string)",
      "function symbol() external view returns (string)",
      "function totalSupply() external view returns (uint256)",
    ],
    provider
  );

  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();

  let contractData = {
    name: name,
    symbol: symbol,
    totalSupply: totalSupply.toString(),
  };

  // console.log(contractData);
  return contractData;
}

async function fetchNFTMetadata(
  contractAddress: string,
  tokenId: string
): Promise<void> {
  const contract = new ethers.Contract(
    contractAddress,
    ["function tokenURI(uint256 tokenId) external view returns (string)"],
    provider
  );

  let tokenURI = await contract.tokenURI(tokenId);

  if (tokenURI.startsWith("ipfs://")) {
    tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  const { data } = await axios.get(tokenURI);
  // console.log(data);
  return data;
}

const contractAddress = "0xB62C414ABf83c0107DB84f8dE1c88631C05A8D7B";
const tokenId = "2";

fetchNFTMetadata(contractAddress, tokenId);
fetchNFTContractData(contractAddress);
