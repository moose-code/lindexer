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
  tokenId: string
): Promise<any> {
  const contract = new ethers.Contract(
    contractAddress,
    ["function tokenURI(uint256 tokenId) external view returns (string)"],
    provider
  );

  let tokenURI = await contract.tokenURI(tokenId);

  if (tokenURI.startsWith("ipfs://")) {
    tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    console.log("unknown metadata", tokenURI)
  }

  const { data } = await axios.get(tokenURI);

  if (data?.image.startsWith("ipfs://")) {
    data.image = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    console.log("unknown image metadata", tokenURI)
  }

  return data;
}

const getUnfetchedNfts = () => {
  const sql = `SELECT token.*
  FROM "public"."token"
  LEFT JOIN "public"."metadata"
  ON token."tokenId" = metadata."tokenId"
  WHERE metadata."id" IS NULL
  LIMIT 100;
  `

  return db.any(sql)
    .then(async rawSqlData => {
      const metadata = await Promise.all(rawSqlData.map(dataItem => {
        const { tokenId, collection } = dataItem
        return fetchNFTMetadata(collection, tokenId).then(metadata => {
          return {
            ...metadata,
            tokenId: tokenId,
            collection: collection
          }
        })
      }))

      const metadataToSave = metadata.map(({ name, description, image, collection, tokenId, attributes }) => {
        return {
          id: `met-${collection}-${tokenId}`, tokenId: tokenId, name, description, image, event_chain_id: 1, event_id: 1
        }
      })

      const metadata_columns = [
        'id',
        'tokenId',
        'name',
        'description',
        'image',
        'event_chain_id',
        'event_id'
      ];

      const metadata_tableName = new pgp.helpers.TableName({ table: 'metadata', schema: 'public' });

      const metadata_query = pgp.helpers.insert(metadataToSave, metadata_columns, metadata_tableName);

      db.none(metadata_query)
        .then(() => {
          console.log("Metadata inserted successfully");
        })
        .catch(error => {
          console.error("ERROR:", error);
        });

      const attributesToSave = metadata.map(({ collection, tokenId, attributes }) => {
        return attributes.map((attribute: any) => {
          const { trait_type, value } = attribute
          return {
            id: `atr-${collection}-${tokenId}-${trait_type}`, tokenId, trait_type, value, event_chain_id: 1, event_id: 1
          }
        })
      }).flat()

      console.log(attributesToSave)

      const attributes_columns = [
        'id',
        'tokenId',
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
          console.error("ERROR:", error);
        });

      return rawSqlData.length > 0
    })
    .catch(error => {
      console.log('ERROR:', error); // print the error
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

// Call the function
continuouslyFetchNFTs()
  .then(() => console.log('Finished fetching NFTs.'))
  .catch((error) => console.error('An error occurred:', error));


runCheckCollections()

