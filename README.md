[![wakatime](https://wakatime.com/badge/user/df445858-58a6-4172-a4be-3b67be4d426e/project/018e89e8-f099-4de1-af7a-ba0ee730144d.svg)](https://wakatime.com/badge/user/df445858-58a6-4172-a4be-3b67be4d426e/project/018e89e8-f099-4de1-af7a-ba0ee730144d)

# Poring Adventure

Dive into the enchanting world of Poring Adventure! Experience turn-based combat, cooperative gameplay, and RPG elements set in a vibrant universe inspired by Ragnarok Online.

## A look around

### Character creation

Pick a name, a look, and one of the classes. Each card spells out what the class
is for and the stats it starts with, plus the whole skill ladder it will unlock
on the way to level 50 — so the choice is made with the endgame visible, not
guessed at.

<img width="404" height="756" alt="Character creation" src="https://github.com/user-attachments/assets/f131744d-27e7-4d02-95d4-43b3883ea489" />

### Profile

The character sheet: equipment around the sprite, health and mana, and every
derived stat with the bonus your gear is contributing. It is also the hub —
guild, spells, and the tabs across the bottom lead everywhere else.

<img width="404" height="757" alt="Profile" src="https://github.com/user-attachments/assets/ba0b0fa4-43c1-4886-9f87-0fc93086062d" />

### Guild

Guilds pool what members do: shared tasks, blessings that buff everyone, a
token shelf to spend the proceeds on, and a guild boss the whole roster chips
away at together.

<img width="411" height="757" alt="Guild" src="https://github.com/user-attachments/assets/ba0942e3-1d9d-4154-8207-c02e5577b7f0" />

### Dungeons

A dungeon is a run of bosses fought in order on a single entry. The entry is
spent walking in, and any exit that is not a kill fails the run — so the card
shows the level range and what is blocking you before you commit.

<img width="405" height="764" alt="Dungeons" src="https://github.com/user-attachments/assets/74d7b441-7ec3-42fb-af28-3c7810b4e5d1" />

### Professions

The other half of the economy: gathering, crafting, and hiring. Players post
what they can make, take commissions from others, and supply the market that
the rest of the game buys from.

<img width="399" height="755" alt="Professions" src="https://github.com/user-attachments/assets/e3cbe3ea-4e09-4a36-aec0-7eacf39e1a49" />

### Co-op combat

Turn-based fights against packs of monsters, with a party sharing one turn
order. Skills, buffs and debuffs resolve live over websockets, so everyone sees
the same fight at the same time.

<img width="400" height="752" alt="Co-op combat" src="https://github.com/user-attachments/assets/34b37f84-fc66-4883-9296-9d97e7ee1800" />

## Overview

Poring Adventure is a dynamic RPG mini-game featuring cooperative multiplayer functionality via websockets. Immerse yourself in nostalgic sprites from Ragnarok Online, and explore an array of RPG elements including character classes and customizable stats.

### Try It Now!

**Live Preview**: [Poring Adventure](https://poring-adventure.netlify.app)

## Getting Started

### Prerequisites

Make sure you have Node.js and Yarn installed on your machine.

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/kidmortal/poring-adventure.git
cd poring-adventure
```

Install dependencies:

```bash
yarn install
```

### Running the App

Start the development server:

```bash
yarn dev
```

Build the project locally:

```bash
yarn run build:local
```

### Building the App

1. **Create a Keystore**: Generate a keystore file named `poringadventure.keystore` and place it in the `android` folder.

2. **Google services**: Generate a google-services.json file named on firebase and place it in the `android/app` folder.

3. **Build React App**:

```bash
yarn run build:local
```

4. **Generate assets**: (Optional) in case you changed something inside /resources

```bash
yarn run build:assets
```

5. **Sync with Capacitor**: Update dependencies and sync the React build with Capacitor:

```bash
yarn run sync:app
```

6. **Generate APK or AAB File**: Update the version in `android/app/build.gradle`, then generate the APK or AAB file:

```bash
yarn run build:app
```

---

This README provides a brief overview of Poring Adventure, including its features, live preview link, setup instructions, and steps for building the app. Feel free to explore the repository and embark on an epic adventure with Poring Adventure!
