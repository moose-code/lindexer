import React from "react";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_NFTS_AT_COLLECTION_ID } from "../gql_queries.js";
import NftThumbnail from "../components/NFTThumbnail";

const CollectionPage = () => {
  let { collection } = useParams();

  let { data, loading, error } = useQuery(GET_NFTS_AT_COLLECTION_ID, {
    variables: { collectionId: collection ?? "" },
  });

  const pageSize = 15; // best as multiples of 5

  const [pageNumber, setPageNumber] = React.useState(1);

  const previousPage = () => {
    //TODO change paginated query
    setPageNumber((pageNumber) => pageNumber - 1);
  };

  const nextPage = () => {
    //TODO change paginated query
    setPageNumber((pageNumber) => pageNumber + 1);
  };

  const goToPage = (page: number) => {
    setPageNumber((_) => page);
  };

  const collectionCount = data?.token_aggregate.aggregate?.count ?? 0;

  return (
    <>
      <div className="flex md:flex-row flex-col">
        {/* <div className="flex flex-col w-full md:w-1/3 mt-2"> */}
        {/*   {collectionFetchState.loading ? ( */}
        {/*     <Loader /> */}
        {/*   ) : collectionFetchState.errorMessage ? ( */}
        {/*     <p>{collectionFetchState.errorMessage}</p> */}
        {/*   ) : collectionFetchState.tokens != {} ? ( */}
        {/*     <div className="mx-auto mt-2"> */}
        {/*       <NFTCollectionCardDetailed */}
        {/*         collection={collectionFetchState.nftcollection} */}
        {/*       /> */}
        {/*     </div> */}
        {/*   ) : ( */}
        {/*     "No collection found" */}
        {/*   )} */}
        {/* </div> */}
        <div className="flex flex-col md:w-2/3 w-full h-full overflow-scroll">
          {loading ? (
            <Loader />
          ) : error ? (
            <p>{error.message}</p>
          ) : data && data?.token.length !== 0 ? (
            <div className="flex flex-col relative">
              <div
                className={`grid grid-cols-3 md:grid-cols-5 gap-0 m-0 md:gap-2 md:mx-4`}
              >
                {data.token.map((token) => {
                  const name = token.metadataMap?.name ?? "";
                  const image = token.metadataMap?.image ?? "";
                  return <NftThumbnail name={name} image={image} />;
                })}
              </div>
              <div className="flex flex-row m-2 justify-center text-white">
                {pageNumber > 1 ?? (
                  <>
                    <button
                      className="m-2"
                      onClick={(_) => {
                        goToPage(1);
                      }}
                    >
                      First
                    </button>
                    <button
                      className="m-2"
                      onClick={(_) => {
                        previousPage();
                      }}
                    >
                      Previous
                    </button>
                  </>
                )}
                <span>{pageNumber > 3 ? "..." : null}</span>
                {Array.from({ length: 5 }, (_, index) => (
                  <>
                    {pageNumber + index + 1 - 3 > 0 &&
                      pageNumber + index + 1 - 3 < collectionCount / pageSize ? ( // prevents the page number from going below 0 and above the total number of pages
                      <button
                        className={`m-2 ${pageNumber + index + 1 - 3 == pageNumber
                            ? "underline"
                            : ""
                          }`}
                        onClick={(_) => {
                          goToPage(Math.round(pageNumber + index + 1 - 3));
                        }}
                        key={index}
                      >
                        {Math.round(pageNumber + index + 1 - 3)}
                        {/*  // therefor shows 2 above and 2 below the current active page */}
                      </button>
                    ) : null}
                  </>
                ))}
                <span>
                  {pageNumber < collectionCount / pageSize - 4 ? "..." : null}
                </span>
                {pageNumber < collectionCount / pageSize ? (
                  <>
                    <button
                      className="m-2"
                      onClick={(_) => {
                        nextPage();
                      }}
                    >
                      Next
                    </button>
                    <button
                      className="m-2"
                      onClick={(_) => {
                        goToPage(collectionCount / pageSize - 1);
                      }}
                    >
                      Last
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            "No tokens found"
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
