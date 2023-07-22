const NFTThumbnail = ({ token }) => {
  return (
    <div className="m-2">
      <img src={token.image} className={"w-full max-w-[300px] h-auto "} />
      <p className={`text-xs`}>{token.name}</p>
    </div>
  );
};

export default NFTThumbnail;
