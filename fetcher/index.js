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
// const nftDataList = con.networks.flatMap((network: any) =>
//   network.contracts.flatMap((contract: any) =>
//     contract.address.map((address: string) => ({
//       id: address,
//     }))
//   )
// );
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
const runCheckCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    SELECT *
    FROM "public"."nftcollection"
    WHERE "name" IS NULL AND "symbol" IS NULL;
`;
    const nftDataList = yield db.any(sql)
        .then(data => {
        return data;
    })
        .catch(error => {
        console.log("error getting data", error);
        return [];
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
});
function fetchNFTMetadata(contractAddress, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.ethers.Contract(contractAddress, ["function tokenURI(uint256 tokenId) external view returns (string)"], provider);
        let tokenURI = yield contract.tokenURI(tokenId);
        if (tokenURI.startsWith("ipfs://")) {
            tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        else {
            console.log("unknown metadata", tokenURI);
        }
        const { data } = yield axios_1.default.get(tokenURI);
        if (data === null || data === void 0 ? void 0 : data.image.startsWith("ipfs://")) {
            data.image = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        else {
            console.log("unknown image metadata", tokenURI);
        }
        return data;
    });
}
const getUnfetchedNfts = () => {
    const sql = `SELECT token.*
  FROM "public"."token"
  LEFT JOIN "public"."metadata"
  ON token."tokenId" = metadata."tokenId"
  WHERE metadata."id" IS NULL
  LIMIT 100;
  `;
    return db.any(sql)
        .then((rawSqlData) => __awaiter(void 0, void 0, void 0, function* () {
        const metadata = yield Promise.all(rawSqlData.map(dataItem => {
            const { tokenId, collection } = dataItem;
            return fetchNFTMetadata(collection, tokenId).then(metadata => {
                return Object.assign(Object.assign({}, metadata), { tokenId: tokenId, collection: collection });
            });
        }));
        const metadataToSave = metadata.map(({ name, description, image, collection, tokenId, attributes }) => {
            return {
                id: `met-${collection}-${tokenId}`, tokenId: tokenId, name, description, image, event_chain_id: 1, event_id: 1
            };
        });
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
            return attributes.map((attribute) => {
                const { trait_type, value } = attribute;
                return {
                    id: `atr-${collection}-${tokenId}-${trait_type}`, tokenId, trait_type, value, event_chain_id: 1, event_id: 1
                };
            });
        }).flat();
        console.log(attributesToSave);
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
        return rawSqlData.length > 0;
    }))
        .catch(error => {
        console.log('ERROR:', error); // print the error
    });
};
function continuouslyFetchNFTs() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const result = yield getUnfetchedNfts();
            if (!result) {
                // If the function returns false, wait for 5 seconds before running it again
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    });
}
// Call the function
continuouslyFetchNFTs()
    .then(() => console.log('Finished fetching NFTs.'))
    .catch((error) => console.error('An error occurred:', error));
runCheckCollections();
