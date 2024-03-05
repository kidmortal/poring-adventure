import { ReactElement, ReactNode } from "react";

type WhenProps = {
  children: ReactNode | (() => void);
  value: boolean;
};

export function When({ children, value }: Readonly<WhenProps>) {
  if (value) {
    return (
      typeof children === "function" ? children() : children
    ) as ReactElement;
  }

  return <></>;
}
