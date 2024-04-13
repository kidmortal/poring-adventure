import { CharacterHead } from "@/components/CharacterInfo";
import { When } from "@/components/When";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";

export function GuildApplicationInfo({
  application,
  permissionLevel,
}: {
  application: GuildApplication;
  permissionLevel: number;
}) {
  const appearance = application.user?.appearance;
  return (
    <div className={styles.applicationInfoContainer}>
      <div className={styles.applicantInfo}>
        <When value={!!appearance}>
          <CharacterHead head={appearance?.head} gender={appearance?.gender} />
        </When>
        <div className={styles.memberInfo}>
          <span>{application.user.name}</span>
          <span>Level: {application.user.stats?.level}</span>
        </div>
      </div>

      <When value={permissionLevel > 0}>
        <div className={styles.applicationActions}>
          <Button label="Accept" theme="success" />
          <Button label="Reject" theme="danger" />
        </div>
      </When>
    </div>
  );
}
