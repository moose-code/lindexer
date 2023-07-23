import React from "react";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COLLECTION_WITH_TOKENS } from "../gql_queries.js";
import NftThumbnail from "../components/NFTThumbnail";
import { NFTCollectionCardDetailed } from "../components/NFTCollectionCard.js";
import NftModal, { Token } from "../components/NftModal";

const PAGE_SIZE = 15; // best as multiples of 5

type PageSelectorProps = {
  pageNumber: number;
  goToPage: (n: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  collectionCount: number;
};

const PageSelector = ({
  pageNumber,
  goToPage,
  previousPage,
  nextPage,
  collectionCount,
}: PageSelectorProps) => {
  return (
    <div className="flex flex-row m-2 justify-center text-white">
      {pageNumber > 1 && (
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
      <span>{pageNumber > 3 && "..."}</span>
      {Array.from({ length: 5 }, (_, index) => (
        <>
          {pageNumber + index + 1 - 3 > 0 &&
            pageNumber + index + 1 - 3 < collectionCount / PAGE_SIZE && ( // prevents the page number from going below 0 and above the total number of pages
              <button
                className={`m-2 ${pageNumber + index + 1 - 3 == pageNumber ? "underline" : ""
                  }`}
                onClick={(_) => {
                  goToPage(Math.round(pageNumber + index + 1 - 3));
                }}
                key={index}
              >
                {Math.round(pageNumber + index + 1 - 3)}
                {/*  // therefor shows 2 above and 2 below the current active page */}
              </button>
            )}
        </>
      ))}
      <span>{pageNumber < collectionCount / PAGE_SIZE - 4 && "..."}</span>
      {pageNumber < collectionCount / PAGE_SIZE && (
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
              goToPage(collectionCount / PAGE_SIZE - 1);
            }}
          >
            Last
          </button>
        </>
      )}
    </div>
  );
};

const CollectionPage = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const { collection } = useParams();

  const skip = (pageNumber - 1) * PAGE_SIZE;

  let { data, loading, error } = useQuery(GET_COLLECTION_WITH_TOKENS, {
    variables: { collectionId: collection ?? "", limit: PAGE_SIZE, skip },
  });

  const openNftInModal = (token: Token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

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
  const nftcollection = data?.nftcollection[0];
  const collectionName = nftcollection?.name ?? "";
  const collectionContractAddress = nftcollection?.contractAddress ?? "";
  const collectionMaxSupply = nftcollection?.maxSupply ?? 0;
  const collectionCurrentSupply = nftcollection?.currentSupply ?? 0;

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error.message}</p>
        ) : (
          <>
            <div className="flex flex-col w-full mt-2">
              <div className="mx-auto mt-2">
                <NFTCollectionCardDetailed
                  name={collectionName}
                  contractAddress={collectionContractAddress}
                  maxSupply={collectionMaxSupply}
                  currentSupply={collectionCurrentSupply}
                />
              </div>
            </div>
            <div className="flex flex-col md:w-6/12 h-full">
              {data && data?.nftcollection[0]?.tokensMap.length !== 0 ? (
                <div className="w-full flex flex-col relative">
                  <div
                    className={`grid grid-cols-3 md:grid-cols-5 gap-0 m-0 md:gap-2 md:mx-4`}
                  >
                    {nftcollection?.tokensMap.map((token) => {
                      let { collection, tokenId, metadataMap, owner } = token;
                      if (metadataMap) {
                        const { name, image, description, attributesMap } =
                          metadataMap;
                        const attributes = attributesMap.map((a) => ({
                          trait_type: a.trait_type,
                          value: a.value,
                        }));
                        return (
                          <NftThumbnail
                            name={name}
                            image={image}
                            tokenId={tokenId}
                            onClick={() =>
                              openNftInModal({
                                name,
                                imageUrl: image,
                                description,
                                attributes,
                                collection,
                                tokenId,
                                owner,
                              })
                            }
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              ) : (
                <p> "No tokens found"</p>
              )}
            </div>
          </>
        )}
        <PageSelector
          pageNumber={pageNumber}
          goToPage={goToPage}
          previousPage={previousPage}
          nextPage={nextPage}
          collectionCount={collectionCount}
        />

        {selectedToken && (
          <NftModal
            showModal={showModal}
            setShowModal={setShowModal}
            token={selectedToken}
          />
        )}
      </div>
    </>
  );
};

export default CollectionPage;
