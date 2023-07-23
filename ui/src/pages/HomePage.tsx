import React from "react";
import Search from "../components/svgs/Search";
import NftCollections from "../components/NftCollections.tsx";

function HomePage() {
  const [userAddress, setUserAddress] = React.useState("");

  const handleInputChange = (e: any) => {
    setUserAddress(e.target.value);
  };

  // async function handleClick() {
  //   if (userAddress.length > 0) {
  //     setUserFetchState({ ...userFetchState, loading: true });
  //     reset();
  //     let isEns = userAddress.includes(".eth");
  //
  //     let address = isEns ? await getAddressFromENS(userAddress) : userAddress;
  //     let user = await fetchUser(address);
  //     setUserFetchState(user);
  //   }
  // }

  // const handleEnterClicked = (event) => {
  //   if (event.keyCode === 13) {
  //     handleClick();
  //   }
  // };
  //

  return (
    <>
      <div className="flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Linea NFT Indexing viewer
          </h1>
        </div>
        <div className="my-6 ">
          <div className="flex flex-row w-full">
            <input
              type="text"
              placeholder="Search a users address or ens handle here"
              className=" w-full md:w-[80%] md:min-w-[600px] text-xs md:text-sm p-2 md:p-4 border-1 rounded-lg text-black"
              value={userAddress}
              onChange={handleInputChange}
            // onKeyDown={handleEnterClicked}
            />
            <button
              className="w-[60px] ml-4 p-2 border-1 rounded-lg bg-white hover:bg-gray-800 focus:bg-gray-600"
              // onClick={handleClick}
              onClick={() => { }}
            >
              <Search />
            </button>
          </div>
          {/* <p>{userFetchState.errorMessage}</p> */}
        </div>
        {/* {userFetchState.loading ? ( */}
        {/*   <Loader /> */}
        {/* ) : tokens && tokens.length > 0 ? ( */}
        {/*   <div className="flex flex-row flex-wrap justify-center max-h-[70vh] overflow-y-auto overflow-scroll border rounded border-white"> */}
        {/*     {tokens.map((token) => { */}
        {/*       let size = tokens && tokens.length > 4 ? "100px" : "300px"; */}
        {/*       return <NFTThumbnail token={token} size={size} />; */}
        {/*     })} */}
        {/*   </div> */}
        {/* ) : ( */}
        {/* )} */}
        <NftCollections />
      </div>
    </>
  );
}

export default HomePage;
