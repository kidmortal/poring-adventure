import cn from "classnames";
import styles from "./style.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLDivElement> {
  label: string;
}

export function Button({ label, className, ...rest }: Props) {
  return (
    <div className={cn(styles.container, className)} {...rest}>
      {label}
    </div>
  );
}
