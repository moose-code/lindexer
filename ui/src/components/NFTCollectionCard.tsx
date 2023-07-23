import { Link } from "react-router-dom";

type NFTCollectionCardProps = {
  name: string;
  currentSupply: number;
  maxSupply: number;
  contractAddress: string;
};

const NFTCollectionCard = ({
  name,
  currentSupply,
  maxSupply,
  contractAddress,
}: NFTCollectionCardProps) => {
  return (
    <div className="mt-6 max-w-[1200px]">
      <Link to={`/collection/${contractAddress}`}>
        <div className={"border-1 rounded-lg relative group"}>
          <img
            src={
              "https://xdc.blocksscan.io/_nuxt/img/nft-placeholder.813e0c0.svg"
            }
            className="w-[80px] h-[80px] md:w-[220px] md:h-[220px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 w-[80px] h-[80px] md:w-[220px] md:h-[220px] bg-black bg-opacity-80 text-white p-2 text-center">
            {name}
            <span className="text-sm">Supply: {currentSupply}</span>
            <span className="text-sm">
              max supply: {maxSupply == 0 ? "∞" : maxSupply}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NFTCollectionCard;
