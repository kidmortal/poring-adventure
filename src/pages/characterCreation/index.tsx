import { useCharacterCreationStore } from '@/store/characterCreation';
import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMainStore } from '@/store/main';
import { Query } from '@/store/query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { ClassBlock } from './ClassBlock';
import Input from '@/components/shared/Input';
import Switch from '@/components/shared/Switch';

/** Two options, so a switch rather than a pair of raw radio buttons. */
function GenderSelector() {
  const store = useCharacterCreationStore();
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>Gender</span>
      <Switch
        leftLabel="Male"
        rightLabel="Female"
        selected={store.gender === 'male' ? 'left' : 'right'}
        onSelect={(value) => store.setGender(value === 'left' ? 'male' : 'female')}
      />
    </div>
  );
}

export function CharacterCreationPage() {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const mainStore = useMainStore();
  const store = useCharacterCreationStore();

  const query = useQuery({
    queryKey: [Query.ALL_CHARACTERS],
    enabled: !!mainStore.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.users.getAllClasses(),
  });

  const newUserData: CreateUserPayload = {
    name: store.characterName,
    gender: store.gender,
    classId: store.selectedClass?.id ?? 1,
    costume: store.selectedClass?.costume,
  };

  const newCharacterMutation = useMutation({
    mutationFn: () => api.users.createUser(newUserData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  if (newCharacterMutation.isPending) {
    return <FullscreenLoading info="Character Creation" />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create your character</h1>

      <div className={styles.form}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Name</span>
          <Input placeholder="Character name" onChange={(e) => store.setCharacterName(e.target.value)} />
        </div>
        <GenderSelector />
      </div>

      {/* Only the class list scrolls, so the name, the gender and the button
          stay put however many classes there are. */}
      <div className={styles.classList}>
        {/* Said once for the list rather than on every card, where five copies
            of the same sentence were louder than the classes. */}
        <span className={styles.fieldLabel}>Class · tap a skill to read it</span>
        <ForEach
          items={query.data}
          render={(characterClass) => (
            <ClassBlock
              key={characterClass.id}
              characterClass={characterClass}
              selectedGender={store.gender}
              selected={store.selectedClass?.id === characterClass.id}
              onClick={() => store.setSelectedClass(characterClass)}
            />
          )}
        />
      </div>

      <Button
        label="Create Character"
        onClick={() => newCharacterMutation.mutate()}
        disabled={!store.selectedClass || !store.characterName}
      />
    </div>
  );
}
