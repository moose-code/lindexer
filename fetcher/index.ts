import { ethers } from "ethers";
import axios from "axios";
import { config } from "dotenv";
import pgPromise from "pg-promise";
import { readFileSync } from "fs";
import { parse } from "yaml";
config();

const provider = new ethers.JsonRpcProvider(
  `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
);

// Database setup
const DATABASE_URI =
  process.env.DATABASE_URI ||
  "postgresql://postgres:testing@localhost:5432/envio-dev";
const pgp = pgPromise();
const db = pgp(DATABASE_URI);

const configFile = readFileSync("../config.yaml", "utf8");
const con = parse(configFile);

const nftDataList = con.networks.flatMap((network: any) =>
  network.contracts.flatMap((contract: any) =>
    contract.address.map((address: string) => ({
      id: address,
    }))
  )
);

async function updateNFTData(nftData: any) {
  const contract = new ethers.Contract(
    nftData.id,
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

  // Update nftData with the information fetched
  nftData.name = name;
  nftData.symbol = symbol;
  nftData.maxSupply = totalSupply.toString();

  // Update data in the database
  return db
    .none(
      `UPDATE nftcollection SET 
      "name" = $1, 
      "symbol" = $2, 
      "maxSupply" = $3 
    WHERE "id" = $4`,
      [nftData.name, nftData.symbol, nftData.maxSupply, nftData.id]
    )
    .catch((error) => {
      console.error(
        `Error updating data for the contract ID: ${nftData.id}`,
        error
      );
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
