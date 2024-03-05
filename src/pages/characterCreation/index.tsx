import { useCharacterCreationStore } from "@/store/characterCreation";
import styles from "./style.module.scss";
import cn from "classnames";

function Character({
  selected,
  name,
  bodySrc,
  onClick,
  headSrc,
}: {
  selected: string;
  name: string;
  onClick: (name: string) => void;
  bodySrc: string;
  headSrc: string;
}) {
  return (
    <div className={styles.characterContainer}>
      <span>{name}</span>
      <div
        onClick={() => onClick(name)}
        className={cn(styles.character, {
          [styles.selected]: selected === name,
        })}
      >
        <img className={styles.head} src={headSrc} />
        <img className={styles.body} src={bodySrc} />
      </div>
    </div>
  );
}

function CharacterPicker({
  selected,
  onClick,
}: {
  selected: string;
  onClick: (name: string) => void;
}) {
  return (
    <div className={styles.container}>
      <h1>Pick a class</h1>
      <div className={styles.classList}>
        <Character
          name="Acolyte"
          headSrc="assets/female_head.png"
          bodySrc="assets/acolyte.png"
          selected={selected}
          onClick={onClick}
        />
        <Character
          name="Assassin"
          headSrc="assets/female_head.png"
          bodySrc="assets/assassin.png"
          selected={selected}
          onClick={onClick}
        />
        <Character
          name="Knight"
          headSrc="assets/female_head.png"
          bodySrc="assets/knight.png"
          selected={selected}
          onClick={onClick}
        />
        <Character
          name="Mage"
          headSrc="assets/female_head.png"
          bodySrc="assets/mage.png"
          selected={selected}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export function CharacterCreationPage() {
  const store = useCharacterCreationStore();
  return (
    <div className={styles.container}>
      <input placeholder="Character name" />
      <CharacterPicker
        selected={store.selectedCharacterClass}
        onClick={(c) => store.setSelectedCharacterClass(c)}
      />
      <button>Create</button>
    </div>
  );
}
