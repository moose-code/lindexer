import axios from "axios";
import { ethers } from "ethers";

const hasuraEndpoint = "";

const fetchUser = async (address) => {
  let userTokensQuery = `query MyQuery ($address: String!) {
      user(where: {address: {_ilike: $address}})
      {
        tokensMap {
            id
        }
      }
    }
  `;

  try {
    let userData = await axios.post(
      hasuraEndpoint,
      JSON.stringify({
        query: userTokensQuery,
        variables: { address: address },
        operationName: "MyQuery",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    let errorMessage;
    let user = userData.data.data.user;
    if (user.length === 0) {
      errorMessage = "User not found";
    } else if (user[0] && user[0]?.tokensMap == []) {
      errorMessage = "User has no tokens";
    }

    console.log("user[0]");
    console.log(user[0]);
    return {
      loading: false,
      errorMessage: errorMessage,
      user: user[0],
    };
  } catch (error) {
    let errorMessage = "Failed to fetch user";
    console.error(`Error fetching data: ${error}`);
    return {
      loading: false,
      errorMessage: errorMessage,
      user: { tokenMap: [] },
    };
  }
};

const fetchCollection = async (address) => {
  let collectionQuery = `query MyQuery ($address: String!) {
        nftcollection(where: {contractAddress: {_ilike: $address}}) {
          name
          symbol
          maxSupply
          contractAddress
          currentSupply
          event_chain_id
        }
      }
      
    `;

  try {
    let request = await axios.post(
      hasuraEndpoint,
      JSON.stringify({
        query: collectionQuery,
        variables: { address: address },
        operationName: "MyQuery",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    let nftcollection = request.data.data.nftcollection[0];
    let errorMessage;

    return {
      loading: false,
      errorMessage: errorMessage,
      nftcollection: nftcollection,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch nft collections";
    console.error(`Error fetching data: ${error}`);
    return {
      loading: false,
      errorMessage: errorMessage,
      nftcollection: {},
    };
  }
};

const fetchCollections = async () => {
  let collectionsQuery = `query MyQuery {
        nftcollection {
          name
          symbol
          maxSupply
          contractAddress
          currentSupply
          event_chain_id
        }
      }
      
    `;

  try {
    let request = await axios.post(
      hasuraEndpoint,
      JSON.stringify({
        query: collectionsQuery,
        variables: {},
        operationName: "MyQuery",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    let nftcollections = request.data.data.nftcollection;
    let errorMessage;
    if (nftcollections["length"] === 0) {
      errorMessage = "Collections not found";
    }

    return {
      loading: false,
      errorMessage: errorMessage,
      nftcollections: nftcollections,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch nft collections";
    console.error(`Error fetching data: ${error}`);
    return {
      loading: false,
      errorMessage: errorMessage,
      nftcollections: [],
    };
  }
};

const fetchCollectionTokens = async (address, offset, limit) => {
  let collectionTokensQuery = `query MyQuery ($address: String!, $offset: Int!, $limit: Int!) {
            token(where: {collection: {_ilike: $address}}, order_by: {tokenId: asc}, limit: $limit, offset: $offset) {
            id
            }
        }
        `;

  try {
    let request = await axios.post(
      hasuraEndpoint,
      JSON.stringify({
        query: collectionTokensQuery,
        variables: { address: address, limit: limit, offset: offset },
        operationName: "MyQuery",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    let tokens = request.data.data.token;

    let errorMessage;
    if (tokens["length"] === 0) {
      errorMessage = "Tokens not found";
    }

    return {
      loading: false,
      errorMessage: errorMessage,
      tokens: tokens,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch tokens";
    console.error(`Error fetching data: ${error}`);
    return {
      loading: false,
      errorMessage: errorMessage,
      tokens: [],
    };
  }
};

const fetchCollectionCount = async (address) => {
  let collectionCountQuery = `query MyQuery ($address: String!) {          
            token_aggregate(where: {collection: {_ilike: $address}}) {
              aggregate {
                count
              }
            }
        }
        `;

  try {
    let request = await axios.post(
      hasuraEndpoint,
      JSON.stringify({
        query: collectionCountQuery,
        variables: { address: address },
        operationName: "MyQuery",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    let count = request.data.data.token_aggregate.aggregate.count;

    let errorMessage;
    if (count == 0) {
      errorMessage = "No NFT's in this collection, something seems odd";
    }

    return {
      loading: false,
      errorMessage: errorMessage,
      count: count,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch count of tokens";
    console.error(`Error fetching data: ${error}`);
    return {
      loading: false,
      errorMessage: errorMessage,
      count: 0,
    };
  }
};

async function getAddressFromENS(ensName) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth.llamarpc.com"
  );

  try {
    const address = await provider.resolveName(ensName);
    return address;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return null;
  }
}

export {
  fetchUser,
  fetchCollections,
  fetchCollection,
  fetchCollectionTokens,
  getAddressFromENS,
  fetchCollectionCount,
};
