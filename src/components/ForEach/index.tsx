import React from "react";

type Props<T> = {
  items: T[] | undefined;
  render: (item: T, idx: number) => React.ReactNode;
};

export default function ForEach<T>(props: Props<T>) {
  return <>{props.items?.map((item, idx) => props.render(item, idx))}</>;
}
