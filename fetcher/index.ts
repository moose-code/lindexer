import { ethers } from "ethers";
import axios from "axios";
import { config } from "dotenv";
config();

const provider = new ethers.JsonRpcProvider(
  `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
);

// name
// symbol
// max supply

async function fetchNFTMetadata(
  contractAddress: string,
  tokenId: string
): Promise<void> {
  const contract = new ethers.Contract(
    contractAddress,
    ["function tokenURI(uint256 tokenId) external view returns (string)"],
    provider
  );

  const tokenURI = await contract.tokenURI(tokenId);
  console.log(tokenURI);

  //   const { data } = await axios.get(tokenURI);
  //   console.log(data);
}

const contractAddress = "0xB62C414ABf83c0107DB84f8dE1c88631C05A8D7B";
const tokenId = "2";

fetchNFTMetadata(contractAddress, tokenId);
