import { Link } from "react-router-dom";

type NFTCollectionCardProps = {
  name: string;
  currentSupply: number;
  maxSupply: number;
  contractAddress: string;
};

export const NFTCollectionCardDetailed = ({
  name,
  currentSupply,
  maxSupply,
  contractAddress,
}: NFTCollectionCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className={"flex border-1 rounded-lg relative group"}>
        <img
          src={
            "https://xdc.blocksscan.io/_nuxt/img/nft-placeholder.813e0c0.svg"
          }
          className="w-[80px] h-[80px] md:w-[220px] md:h-[220px]"
        />
        <div className="flex flex-col items-start justify-center p-5 h-[220px] bg-black bg-opacity-80 text-white p-2">
          <table className="text-left">
            <tr>
              <td className="w-28">Name:</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>Supply:</td>
              <td>{currentSupply}</td>
            </tr>
            <tr>
              <td>Max Supply:</td>
              <td>{maxSupply == 0 ? "∞" : maxSupply}</td>
            </tr>
            <tr>
              <td>Contract:</td>
              <td>
                {
                  <a
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    href={`https://lineascan.build/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contractAddress}
                  </a>
                }
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
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
