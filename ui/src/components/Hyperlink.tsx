type HyperLinkProps = {
  href: string;
  children: React.ReactNode;
  openInNewTab?: boolean;
};
const HyperLink = ({ href, children, openInNewTab }: HyperLinkProps) => {
  return (
    <a
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

export default HyperLink;
