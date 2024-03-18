import ForEach from "../ForEach";
import styles from "./style.module.scss";

type Props = {
  buffs?: UserBuff[];
};

export default function BuffList(props: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={props.buffs}
        render={({ buff }) => (
          <div key={buff.id}>
            <img width={25} height={25} src={buff.image} />
          </div>
        )}
      />
    </div>
  );
}
