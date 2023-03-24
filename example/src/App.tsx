import React from 'react'

import ReactProPlayer from 'react-pro-player'
import 'react-pro-player/dist/index.css'

const App = () => {
  return <ReactProPlayer
    poster="https://wallpaperaccess.com/full/2680068.jpg"
    src="https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8"
  />
}

export default App
