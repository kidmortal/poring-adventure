import React from "react";
import cn from "classnames";
import styles from "./style.module.scss";

export type ToolTipDirection = "top" | "bottom" | "left" | "right";

type Props = {
  text: React.ReactNode;
  direction?: ToolTipDirection;
  children: React.ReactNode;
};

export function Tooltip({ text, children, direction = "top" }: Props) {
  return (
    <div className={styles.container}>
      {children}
      <div className={cn(styles.tooltipContainer, styles[direction])}>
        <div className={styles.content}>{text}</div>
      </div>
    </div>
  );
}
