# React Pro Player

react-pro-player is a React video player component that allows you to play HLS (m3u8) files. It provides a customizable video player with features such as play button, progress bar, toggle full screen, and quality selector.

# Installation

You can install react-pro-player using npm or yarn.

## NPM

```bash
npm install react-pro-player
```

## Yarn

```bash
yarn add react-pro-player
```

# Usage

First, import react-pro-player and its stylesheet into your project:

```jsx
import React from 'react'
import ReactProPlayer from 'react-pro-player'
import 'react-pro-player/dist/index.css'
```

Then, you can use the ReactProPlayer component in your app by passing in the src and poster props:

```jsx
const App = () => {
  return (
    <ReactProPlayer
      src='https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8'
      poster='https://wallpaperaccess.com/full/2680068.jpg'
    />
  )
}

export default App
```

# Contributing

Contributions are welcome! If you'd like to contribute to react-pro-player, please submit a pull request with your changes.

# License

react-pro-player is open source software licensed as MIT.
