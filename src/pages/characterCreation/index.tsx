import { useCharacterCreationStore } from '@/store/characterCreation';
import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMainStore } from '@/store/main';
import { Query } from '@/store/query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { ProfessionBlock } from './ProfessionBlock';
import Input from '@/components/shared/Input';

function GenderRadioSelectors() {
  const store = useCharacterCreationStore();
  return (
    <div className={styles.row}>
      <span>{`Gender =>`} </span>
      <div>
        <input
          type="radio"
          id="male"
          name="male"
          value="male"
          onChange={() => store.setGender('male')}
          checked={store.gender === 'male'}
        />
        <label htmlFor="male">male</label>
      </div>
      <div>
        <input
          type="radio"
          id="female"
          name="female"
          value="female"
          onChange={() => store.setGender('female')}
          checked={store.gender === 'female'}
        />
        <label htmlFor="female">female</label>
      </div>
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
    queryFn: () => api.users.getAllProfessions(),
  });

  const newUserData: CreateUserPayload = {
    name: store.characterName,
    gender: store.gender,
    professionId: store.selectedProfession?.id ?? 1,
    costume: store.selectedProfession?.costume,
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
      <h1>Create your character</h1>
      <Input placeholder="Character name" onChange={(e) => store.setCharacterName(e.target.value)} />
      <GenderRadioSelectors />

      <div className={styles.professionListContainer}>
        <ForEach
          items={query.data}
          render={(pro) => (
            <ProfessionBlock
              key={pro.id}
              profession={pro}
              selectedGender={store.gender}
              selected={store.selectedProfession?.id === pro.id}
              onClick={() => store.setSelectedProfession(pro)}
            />
          )}
        />
      </div>

      <Button
        label="Create Character"
        onClick={() => newCharacterMutation.mutate()}
        disabled={!store.selectedProfession || !store.characterName}
      />
    </div>
  );
}
