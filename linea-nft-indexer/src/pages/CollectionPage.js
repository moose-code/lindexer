// import React from "react";
// import Loader from "../components/Loader";
// import collectionConfig from "../collection-config.js";
// import { useParams } from "react-router-dom";
// import { fetchCollection, fetchCollectionTokens } from "../data-fetchers.js";
// import NFTCollectionCardDetailed from "../components/NFTCollectionCardDetailed";
// import { ethers } from "ethers";
// import {
//   fetchCollections,
//   fetchCollectionCount,
//   fetchIPFSJSON,
// } from "../data-fetchers.js";
// import { nftTokenURIABI, contractAddressToRpcUrlMapping } from "../utils.js";
// import NFTThumbnail from "../components/NFTThumbnail";
// import NavBar from "../components/NavBar";

// const CollectionPage = () => {
//   let { collection } = useParams();

//   const [collectionFetchState, setCollectionFetchState] = React.useState({
//     loading: true,
//     errorMessage: null,
//     nftcollection: {},
//   });
//   const [tokensFetchState, setTokensFetchState] = React.useState({
//     loading: true,
//     errorMessage: null,
//     tokens: [],
//   });
//   const [collectionCountState, setCollectionCountState] = React.useState({
//     loading: true,
//     errorMessage: null,
//     count: 0,
//   });

//   const pageSize = 15; // best as multiples of 5

//   const [limit, setLimit] = React.useState(pageSize);
//   const [offset, setOffset] = React.useState(0);
//   const [pageNumber, setPageNumber] = React.useState(1);

//   const [metadata, setMetadata] = React.useState([]);
//   React.useEffect(() => {
//     fetchCollection(collection).then((result) => {
//       setCollectionFetchState((_) => result);
//     });
//   }, []);

//   React.useEffect(() => {
//     fetchCollectionCount(collection).then((result) => {
//       setCollectionCountState((_) => result);
//     });
//   }, []);

//   React.useEffect(() => {
//     fetchCollectionTokens(collection, offset, limit).then((result) => {
//       setTokensFetchState((_) => result);
//     });
//   }, [limit, offset]);

//   React.useEffect(() => {
//     tokensFetchState.tokens.forEach((token) => {
//       let tokenAddressAndTokenId = token.id.split("-");

//       if (tokenAddressAndTokenId[0] && tokenAddressAndTokenId[1]) {
//         async function fetchMetadata() {
//           try {
//             let tokenAddress = tokenAddressAndTokenId[0];
//             let tokenId = tokenAddressAndTokenId[1];

//             let rpcUrl = contractAddressToRpcUrlMapping(tokenAddress);

//             // Create an ethers.js provider
//             const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

//             // Create a contract instance using the token address and ABI
//             const contract = new ethers.Contract(
//               tokenAddress,
//               nftTokenURIABI,
//               provider
//             );

//             // Call the contract's tokenURI function to get the metadata URI
//             let tokenURI = await contract.tokenURI(tokenId);

//             // Fetch the metadata JSON using the URI
//             let isHostedOnIPFS = tokenURI.includes("ipfs://");

//             const isBase64Encoded = tokenURI.includes("base64");

//             const response = isHostedOnIPFS
//               ? await fetchIPFSJSON(tokenURI)
//               : await fetch(tokenURI);

//             let metadataJSON;
//             if (isBase64Encoded) {
//               tokenURI = tokenURI.replace("data:application/json;base64,", "");
//               tokenURI = tokenURI.replace("==", "");
//               const rawString = atob(tokenURI);
//               const decodedObject = JSON.parse(rawString);
//               metadataJSON = decodedObject;
//             } else {
//               metadataJSON = await response.json();
//             }

//             isHostedOnIPFS = metadataJSON.image.includes("ipfs://");

//             if (isHostedOnIPFS) {
//               // map ipfs image url to http gateway
//               metadataJSON.image =
//                 "https://ipfs.io/ipfs/" +
//                 metadataJSON.image.replace("ipfs://", "");
//             }

//             setMetadata((metadata) => [...metadata, metadataJSON]);
//           } catch (error) {
//             console.error(error);
//             // Handle errors
//           }
//         }
//         fetchMetadata();
//       }
//     });
//   }, [tokensFetchState.tokens]);

//   const previousPage = () => {
//     let loadingTokensFetchState = {
//       ...tokensFetchState,
//       loading: true,
//     };
//     setTokensFetchState((_) => loadingTokensFetchState);
//     setPageNumber((pageNumber) => pageNumber - 1);
//     setMetadata((_) => []);
//     setOffset((offset) => offset - pageSize);
//   };

//   const nextPage = () => {
//     let loadingTokensFetchState = {
//       ...tokensFetchState,
//       loading: true,
//     };
//     setTokensFetchState((_) => loadingTokensFetchState);
//     setPageNumber((pageNumber) => pageNumber + 1);
//     setMetadata((_) => []);
//     setOffset((offset) => offset + pageSize);
//   };

//   const goToPage = (page) => {
//     let loadingTokensFetchState = {
//       ...tokensFetchState,
//       loading: true,
//     };
//     setTokensFetchState((_) => loadingTokensFetchState);
//     setPageNumber((_) => page);
//     setMetadata((_) => []);
//     setOffset(() => pageSize * page);
//   };

//   return (
//     <>
//       <NavBar />
//       <div className="flex md:flex-row flex-col">
//         <div className="flex flex-col w-full md:w-1/3 mt-2">
//           {collectionFetchState.loading ? (
//             <Loader />
//           ) : collectionFetchState.errorMessage ? (
//             <p>{collectionFetchState.errorMessage}</p>
//           ) : collectionFetchState.tokens != {} ? (
//             <div className="mx-auto mt-2">
//               <NFTCollectionCardDetailed
//                 collection={collectionFetchState.nftcollection}
//               />
//             </div>
//           ) : (
//             "No collection found"
//           )}
//         </div>
//         <div className="flex flex-col md:w-2/3 w-full h-full overflow-scroll">
//           {tokensFetchState.loading ? (
//             <Loader />
//           ) : tokensFetchState.errorMessage ? (
//             <p>{tokensFetchState.errorMessage}</p>
//           ) : tokensFetchState.tokens != [] ? (
//             metadata.length > 0 ? (
//               <div className="flex flex-col relative">
//                 <div
//                   className={`grid grid-cols-3 md:grid-cols-5 gap-0 m-0 md:gap-2 md:mx-4`}
//                 >
//                   {metadata.map((token) => {
//                     return <NFTThumbnail token={token} />;
//                   })}
//                 </div>
//                 <div className="flex flex-row m-2 justify-center text-white">
//                   {pageNumber > 1 ? (
//                     <>
//                       <button
//                         className="m-2"
//                         onClick={(_) => {
//                           goToPage(1);
//                         }}
//                       >
//                         First
//                       </button>
//                       <button
//                         className="m-2"
//                         onClick={(_) => {
//                           previousPage();
//                         }}
//                       >
//                         Previous
//                       </button>
//                     </>
//                   ) : null}
//                   <span>{pageNumber > 3 ? "..." : null}</span>
//                   {Array.from({ length: 5 }, (_, index) => (
//                     <>
//                       {pageNumber + index + 1 - 3 > 0 &&
//                       pageNumber + index + 1 - 3 <
//                         collectionCountState.count / pageSize ? ( // prevents the page number from going below 0 and above the total number of pages
//                         <button
//                           className={`m-2 ${
//                             pageNumber + index + 1 - 3 == pageNumber
//                               ? "underline"
//                               : ""
//                           }`}
//                           onClick={(_) => {
//                             goToPage(Math.round(pageNumber + index + 1 - 3));
//                           }}
//                           key={index}
//                         >
//                           {Math.round(pageNumber + index + 1 - 3)}
//                           {/*  // therefor shows 2 above and 2 below the current active page */}
//                         </button>
//                       ) : null}
//                     </>
//                   ))}
//                   <span>
//                     {pageNumber < collectionCountState.count / pageSize - 4
//                       ? "..."
//                       : null}
//                   </span>
//                   {pageNumber < collectionCountState.count / pageSize ? (
//                     <>
//                       <button
//                         className="m-2"
//                         onClick={(_) => {
//                           nextPage();
//                         }}
//                       >
//                         Next
//                       </button>
//                       <button
//                         className="m-2"
//                         onClick={(_) => {
//                           goToPage(collectionCountState.count / pageSize - 1);
//                         }}
//                       >
//                         Last
//                       </button>
//                     </>
//                   ) : null}
//                 </div>
//               </div>
//             ) : null
//           ) : (
//             "No tokens found"
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CollectionPage;
