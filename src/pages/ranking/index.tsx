import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { CharacterInfo } from "@/components/CharacterInfo";

export function RankingPage() {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<User[]>([Query.ALL_CHARACTERS]);

  return (
    <div className={styles.container}>
      {query?.map((u) => (
        <div className={styles.characterContainer} key={u.email}>
          <CharacterInfo
            costume={u.appearance.costume}
            gender={u.appearance.gender}
            head={u.appearance.head}
          />
          <span>
            {u.name} - LV {u.level} {u.classname}
          </span>
        </div>
      ))}
    </div>
  );
}
