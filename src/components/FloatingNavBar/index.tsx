import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";

export function FloatingNavBar() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <span onClick={() => navigate("/")}>Home</span>
      <span onClick={() => navigate("/profile")}>Profile</span>
      <span onClick={() => navigate("/ranking")}>Ranking</span>
    </div>
  );
}
