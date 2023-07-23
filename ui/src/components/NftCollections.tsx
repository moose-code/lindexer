import { useQuery } from "@apollo/client";
import Loader from "./Loader.tsx";
import NFTCollectionCard from "./NFTCollectionCard.tsx";
import { GET_NFT_COLLECTIONS } from "../gql_queries.ts";

const NftCollections = () => {
  const { loading, error, data } = useQuery(GET_NFT_COLLECTIONS);

  return (
    <div className="mt-6 max-w-[1200px] w-full flex justify-center">
      {loading ? (
        <Loader />
      ) : error ? (
        <p>{error.message}</p>
      ) : data && data?.nftcollection.length != 0 ? (
        data.nftcollection.map((collection) => {
          let { contractAddress, name, maxSupply, currentSupply } = collection;
          return (
            <NFTCollectionCard
              key={contractAddress}
              name={name ?? ""}
              currentSupply={currentSupply ?? 0}
              maxSupply={maxSupply ?? 0}
              contractAddress={contractAddress}
            />
          );
        })
      ) : (
        "No collections found"
      )}
    </div>
  );
};

export default NftCollections;
