import cn from "classnames";
import styles from "./style.module.scss";
import { Theme } from "@/types/ui";

type Props = {
  label: React.ReactNode;
  theme?: Theme;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function IconButton({
  label,
  className,
  theme = "primary",
  onClick,
  disabled,
}: Props) {
  return (
    <div
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
      className={cn(styles.container, className, styles[theme], {
        [styles.disabled]: disabled,
      })}
    >
      {label}
    </div>
  );
}
