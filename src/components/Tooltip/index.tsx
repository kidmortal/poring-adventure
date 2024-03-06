import React from "react";
import "./style.css";

export function Tooltip(props: { text: string; children: React.ReactNode }) {
  const { text, children } = props;
  return (
    <div className="tooltip">
      {children}
      <span className="tooltiptext">{text}</span>
    </div>
  );
}
