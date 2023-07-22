type NftThumbNailProps = {
  image: string;
  name: string;
  collection: string;
  tokenId: number;
};

const NftThumbnail = ({
  image,
  name,
  tokenId,
  collection,
}: NftThumbNailProps) => {
  return (
    <div className="m-2">
      <img src={image} className={"w-full max-w-[300px] h-auto "} />
      <p className={`text-xs`}>{name}</p>
      <p className={`text-xs`}>{tokenId}</p>
      <p className={`text-xs`}>{collection}</p>
    </div>
  );
};

export default NftThumbnail;
