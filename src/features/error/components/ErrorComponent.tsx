import type { ErrorComponentProps } from "../types";

export default function ErrorComponent({ type = 'ErrorComponent' }: ErrorComponentProps) {
  return <div>{type}</div>;
}