type NftThumbNailProps = {
  image: string;
  name: string;
};

const NftThumbnail = ({ image, name }: NftThumbNailProps) => {
  return (
    <div className="m-2">
      <img src={image} className={"w-full max-w-[300px] h-auto "} />
      <p className={`text-xs`}>{name}</p>
    </div>
  );
};

export default NftThumbnail;
