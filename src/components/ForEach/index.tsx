import React from "react";

type Props<T> = {
  items: T[] | undefined;
  render: (item: T) => React.ReactNode;
};

export default function ForEach<T>(props: Props<T>) {
  return <>{props.items?.map((item) => props.render(item))}</>;
}
