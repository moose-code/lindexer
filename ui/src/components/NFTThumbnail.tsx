import { PLACE_HOLDER_IMAGE_URL } from "../constants";

type NftThumbNailProps = {
  image?: string;
  name: string;
  tokenId: number;
  onClick: any;
};

const NftThumbnail = ({ image, name, tokenId, onClick }: NftThumbNailProps) => {
  return (
    <div onClick={onClick} className="m-2 relative cursor-pointer">
      <img
        src={image ?? PLACE_HOLDER_IMAGE_URL}
        className={"w-full rounded-xl h-full h-auto relative object-cover"}
      />
      <p>{tokenId}</p>
      <div className="absolute top-0 rounded opacity-0 hover:opacity-100 hover:bg-black hover:bg-opacity-80 h-full w-full flex justify-center items-center">
        <table>
          <tr>
            <td className="w-5">ID:</td>
            <td>{tokenId}</td>
          </tr>
          <tr>
            <td className="w-12">Name:</td>
            <td>{name}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default NftThumbnail;
