[![wakatime](https://wakatime.com/badge/user/df445858-58a6-4172-a4be-3b67be4d426e/project/018e89e8-f099-4de1-af7a-ba0ee730144d.svg)](https://wakatime.com/badge/user/df445858-58a6-4172-a4be-3b67be4d426e/project/018e89e8-f099-4de1-af7a-ba0ee730144d)

# Poring Adventure

Character creation: <img width="404" height="756" alt="image" src="https://github.com/user-attachments/assets/f131744d-27e7-4d02-95d4-43b3883ea489" />
Profile: <img width="404" height="757" alt="image" src="https://github.com/user-attachments/assets/ba0b0fa4-43c1-4886-9f87-0fc93086062d" />
Guild: <img width="411" height="757" alt="image" src="https://github.com/user-attachments/assets/ba0942e3-1d9d-4154-8207-c02e5577b7f0" />
Dungeons: <img width="405" height="764" alt="image" src="https://github.com/user-attachments/assets/74d7b441-7ec3-42fb-af28-3c7810b4e5d1" />
Professions: <img width="399" height="755" alt="image" src="https://github.com/user-attachments/assets/e3cbe3ea-4e09-4a36-aec0-7eacf39e1a49" />
Co-op combat: <img width="400" height="752" alt="image" src="https://github.com/user-attachments/assets/34b37f84-fc66-4883-9296-9d97e7ee1800" />






Dive into the enchanting world of Poring Adventure! Experience turn-based combat, cooperative gameplay, and RPG elements set in a vibrant universe inspired by Ragnarok Online.

## Features

### Splash Screen

![Splash Screen](https://github.com/kidmortal/poring-adventure/assets/18023467/28328c0b-eacd-4a00-bb0c-26a919fb0ffc)

### Turn-Based Combat

![Turn-Based Combat](https://github.com/kidmortal/poring-adventure/assets/18023467/f6e5e517-4daa-4e4c-8e4e-4e2b79aa4f11)

### Cooperative Play

![Cooperative Play](https://github.com/kidmortal/poring-adventure/assets/18023467/4506729e-4fd0-474b-bb8a-13f732fef1cc)

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
