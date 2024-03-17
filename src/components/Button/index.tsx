import cn from "classnames";
import styles from "./style.module.scss";

type Props = {
  label: React.ReactNode;
  theme?: "primary" | "secondary" | "danger" | "success";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  label,
  className,
  theme = "primary",
  onClick,
  disabled,
}: Props) {
  return (
    <button
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
    </button>
  );
}
