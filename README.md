Splash

![image](https://github.com/kidmortal/poring-adventure/assets/18023467/28328c0b-eacd-4a00-bb0c-26a919fb0ffc)

Looks like this

![image](https://github.com/kidmortal/poring-adventure/assets/18023467/f6e5e517-4daa-4e4c-8e4e-4e2b79aa4f11)

Turn based combat

![image](https://github.com/kidmortal/poring-adventure/assets/18023467/4506729e-4fd0-474b-bb8a-13f732fef1cc)

Also allows co-op

![image](https://github.com/kidmortal/poring-adventure/assets/18023467/b0ddafc7-a114-4528-bb11-5526b397ae3d)

Summary - RPG mini game with co-op features using websocket.

using sprites from ragnarok, and with RPG elements such as classes and stats.

You can try it here

## Live preview https://poring-adventure.netlify.app

## back-end service repository: https://github.com/kidmortal/poring-adventure-api

### How to run

```
yarn dev
```

```
yarn run build:local
```

etc..., you know the drill. its just react

## Building app

first step: create a keystore to sign the apk, and drop it on android folder.
name it as poringadventure.keystore

Creates react build

```
yarn run build:local
```

Sync react build with capacitor and update dependencies, etc
(change apk version at android/app/build.gradle)

```
yarn run sync:app
```

Generate apk or aab file, change it on capacitor config

```
yarn run build:apk
```
