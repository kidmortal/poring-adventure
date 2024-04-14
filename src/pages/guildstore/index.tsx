import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";

export function GuildStorePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>Nothing here yet</h1>
      <Button label="Back to guild" onClick={() => navigate("/guild")} />
    </div>
  );
}
