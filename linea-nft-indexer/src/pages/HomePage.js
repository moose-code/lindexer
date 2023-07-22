import React from "react";
import Search from "../components/svgs/Search";
import NFTCollectionCard from "../components/NFTCollectionCard"; //todo
import Loader from "../components/Loader";
import axios from "axios";
import NFTThumbnail from "../components/NFTThumbnail";
import {
  fetchCollections,
  getAddressFromENS,
  fetchUser,
} from "../data-fetchers.js";

function HomePage() {
  const [userAddress, setUserAddress] = React.useState("");
  const [userTokens, setUserTokens] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [tokens, setTokens] = React.useState([]);

  const [userFetchState, setUserFetchState] = React.useState({
    loading: false,
    errorMessage: null,
    user: { tokenMap: [] },
  });

  const [collectionsFetchState, setCollectionsFetchState] = React.useState({
    loading: true,
    errorMessage: null,
    nftcollections: [],
  });

  const reset = () => {
    setErrorMessage(""); // reset error message
    setUserTokens([]); // reset user tokens
    setTokens([]); // reset tokens
  };

  React.useEffect(() => {
    reset();
  }, []);

  React.useEffect(() => {
    fetchCollections().then((result) => {
      setCollectionsFetchState((_) => result);
    });
  }, []);

  const handleInputChange = (e) => {
    setUserAddress(e.target.value);
  };

  async function handleClick() {
    if (userAddress.length > 0) {
      setUserFetchState({ ...userFetchState, loading: true });
      reset();
      let isEns = userAddress.includes(".eth");

      let address = isEns ? await getAddressFromENS(userAddress) : userAddress;
      let user = await fetchUser(address);
      setUserFetchState(user);
    }
  }

  const handleEnterClicked = (event) => {
    if (event.keyCode === 13) {
      handleClick();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Linea NFT Indexing viewer
          </h1>
        </div>
        <div className="my-6">
          <div className="flex flex-row w-full">
            <input
              type="text"
              placeholder="Search a users address or ens handle here"
              className=" w-full md:w-[80%] md:min-w-[600px] text-xs md:text-sm p-2 md:p-4 border-1 rounded-lg text-black"
              value={userAddress}
              onChange={handleInputChange}
              onKeyDown={handleEnterClicked}
            />
            <button
              className="w-[60px] ml-4 p-2 border-1 rounded-lg bg-white hover:bg-gray-800 focus:bg-gray-600"
              onClick={handleClick}
            >
              <Search />
            </button>
          </div>
          <p>{errorMessage}</p>
          <p>{userFetchState.errorMessage}</p>
        </div>
        {userFetchState.loading ? (
          <Loader />
        ) : tokens && tokens.length > 0 ? (
          <div className="flex flex-row flex-wrap justify-center max-h-[70vh] overflow-y-auto overflow-scroll border rounded border-white">
            {tokens.map((token) => {
              let size = tokens && tokens.length > 4 ? "100px" : "300px";
              return <NFTThumbnail token={token} size={size} />;
            })}
          </div>
        ) : (
          <div className="mt-6 max-w-[1200px] justify-center grid grid-cols-3 md:grid-cols-4 gap-2 justify-center">
            {collectionsFetchState.loading ? (
              <Loader />
            ) : collectionsFetchState.errorMessage ? (
              <p>{collectionsFetchState.errorMessage}</p>
            ) : collectionsFetchState.nftcollections.length != 0 ? (
              collectionsFetchState.nftcollections.map((collection) => {
                return <NFTCollectionCard collection={collection} />;
              })
            ) : (
              "No collections found"
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
