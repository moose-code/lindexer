import { ethers } from "ethers";
import axios from "axios";
import { config } from "dotenv";
import pgPromise from "pg-promise";
import { readFileSync } from "fs";
import { parse } from "yaml";

// import * as IPFS from 'ipfs-core';

// Node that we use as a backup
let ipfsNode
const ipfsProviders = [
  "gateway.pinata.cloud",
  "cloudflare-ipfs.com",
  "ipfs.io",
  // "dweb.link",
  "gateway.ipfs.io",
  "via0.com",
  "ipfs.eternum.io",
  "cf-ipfs.com",
  // "gw3.io",
  "konubinix.eu",
  "ipfs.eth.aragon.network",
  // "ipfs.scalaproject.io",
  // "dweb.eu.org",
  // "nftstorage.link",
]


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

// const nftDataList = con.networks.flatMap((network: any) =>
//   network.contracts.flatMap((contract: any) =>
//     contract.address.map((address: string) => ({
//       id: address,
//     }))
//   )
// );

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

const runCheckCollections = async () => {
  const sql = `
    SELECT *
    FROM "public"."nftcollection"
    WHERE "name" IS NULL AND "symbol" IS NULL;
`;

  const nftDataList = await db.any(sql)
    .then(data => {
      return data
    })
    .catch(error => {
      console.log("error getting data", error)
      return []
    });

  // Fetch data and update nftData with it, then update the database.
  // This occurs in parrallel.
  Promise.all(nftDataList.map(updateNFTData))
    .then(() => {
      console.log("All data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating data", error);
    });
}



async function fetchNFTMetadata(
  contractAddress: string,
  token_id: string
): Promise<any> {
  const contract = new ethers.Contract(
    contractAddress,
    ["function tokenURI(uint256 token_id) external view returns (string)"],
    provider
  );

  let tokenURI = await contract.tokenURI(token_id);

  let dataReturned
  if (tokenURI.startsWith("ipfs://")) {
    let bucket = parseInt(token_id) % ipfsProviders.length;

    const { data } = await axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      .catch(e => {
        console.log("Errored with", ipfsProviders[bucket], "trying next")
        bucket = (bucket + 1) % ipfsProviders.length
        return axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      })
      .catch(e => {
        bucket = (bucket + 1) % ipfsProviders.length
        console.log("Errored with", ipfsProviders[bucket], "trying next")
        return axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      })
      .catch(e => {
        bucket = (bucket + 1) % ipfsProviders.length
        console.log("Errored with", ipfsProviders[bucket], "trying next")
        return axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      })
      .catch(e => {
        bucket = (bucket + 1) % ipfsProviders.length
        console.log("Errored with", ipfsProviders[bucket], "trying next")
        return axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      })
      .catch(e => {
        bucket = (bucket + 1) % ipfsProviders.length
        console.log("Errored with", ipfsProviders[bucket], "trying next")
        return axios.get(tokenURI.replace("ipfs://", `https://${ipfsProviders[bucket]}/ipfs/`))
      })

    dataReturned = data

  } else {
    console.log("unknown metadata <NOT IPFS>", tokenURI)
  }


  if (dataReturned?.image.startsWith("ipfs://")) {
    dataReturned.image = dataReturned.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    console.log("unknown image metadata", tokenURI)
  }

  return dataReturned;
}

const getUnfetchedNfts = () => {
  const sql = `
  SELECT t.*
  FROM "public"."token" t
  LEFT JOIN "public"."metadata" m ON t."id" = m."token_id"
  WHERE m."token_id" IS NULL
  LIMIT 10;
  `

  return db.any(sql)
    .then(async rawSqlData => {
      const metadata = await Promise.all(rawSqlData.map(dataItem => {
        const { tokenId: token_id, collection } = dataItem
        return fetchNFTMetadata(collection, token_id).then(metadata => {
          return {
            ...metadata,
            token_id: token_id,
            collection: collection
          }
        })
      }))

      const metadataToSave = metadata.map(({ name, description, image, collection, token_id }) => {
        return {
          id: `met${collection}-${token_id}`, token_id: `${collection}-${token_id}`, name, description, image, event_chain_id: 1, event_id: 1
        }
      })

      const metadata_columns = [
        'id',
        'token_id',
        'name',
        'description',
        'image',
        'event_chain_id',
        'event_id'
      ];

      const metadata_tableName = new pgp.helpers.TableName({ table: 'metadata', schema: 'public' });

      const metadata_query = pgp.helpers.insert(metadataToSave, metadata_columns, metadata_tableName);

      let metadata_promise = db.none(metadata_query)
        .then(() => {
          console.log("Metadata inserted successfully");
        })
        .catch(error => {
          console.error("ERROR: (write metadata)", error);
        });

      const attributesToSave = metadata.map((metadataItem) => {
        // console.log("metadataItem", metadataItem)
        const { collection, token_id, attributes } = metadataItem
        return attributes.map((attribute: any) => {
          const { trait_type, value } = attribute
          return {
            id: `atr${collection}-${token_id}${trait_type.replace(/ /g, "_")/* can't have spaces? */}`, metadata_id: `met${collection}-${token_id}`, trait_type, value, event_chain_id: 1, event_id: 1
          }
        })
      }).flat()

      const attributes_columns = [
        'id',
        'metadata_id',
        'trait_type',
        'value',
        'event_chain_id',
        'event_id'
      ];

      const attributes_tableName = new pgp.helpers.TableName({ table: 'attribute', schema: 'public' });

      const attributes_query = pgp.helpers.insert(attributesToSave, attributes_columns, attributes_tableName);

      db.none(attributes_query)
        .then(() => {
          console.log("Attributes inserted successfully");
        })
        .catch(error => {
          // console.log("data for error", metadata[0].token_id)
          // console.log("data for error", attributesToSave)
          console.error("ERROR (writing attribute):", error);
        });

      await metadata_promise; // So that the metadata has finished writing before moving on.

      return rawSqlData.length > 0
    })
    .catch(error => {
      console.log('ERROR <null item query>:', error); // print the error
      return false
    });
}

async function continuouslyFetchNFTs() {
  while (true) {
    const result = await getUnfetchedNfts();

    if (!result) {
      // If the function returns false, wait for 5 seconds before running it again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function main() {
  // ipfsNode = await IPFS.create();

  // const fileAdded = await node.add({
  //   path: "hello.txt",
  //   content: "Hello World 101",
  // });

  // console.log("Added file:", fileAdded.path, fileAdded.cid);

  // const chunks = [];
  // for await (const chunk of node.cat(fileAdded.cid)) {
  //   chunks.push(chunk);
  // }

  // console.log("Retrieved file contents:", chunks.toString());
  // Call the function
  continuouslyFetchNFTs()
    .then(() => console.log('Finished fetching NFTs.'))
    .catch((error) => console.error('An error occurred:', error));
  runCheckCollections()
}

main();

