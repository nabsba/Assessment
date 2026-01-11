import type { LoaderProps } from "../types";

const Loader: React.FC<LoaderProps> = ({ name = 'Loader' }) => {
  return <div>{name}</div>;
};

export default Loader;