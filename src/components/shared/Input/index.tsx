import styles from "./style.module.scss";
type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Input(props: Props) {
  return (
    <div className={styles.container}>
      <input {...props} />
    </div>
  );
}
