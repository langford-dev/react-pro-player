import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { SUPPORTED_MIME_TYPES } from '../constants'
import { TReactProPlayer, THTMLVideoElement } from '../types'
import Hls from 'hls.js'
import { ERROR_MESSAGES } from '../constants/messages'
import { BiPause, BiPlay } from 'react-icons/bi'
import { MdOutlineForward10, MdReplay10, MdFullscreen, MdFullscreenExit } from 'react-icons/md'
import styles from '../../src/styles.module.css'

const ReactProPlayer: FC<TReactProPlayer> = ({ src, poster }) => {
    const reactProPlayerRef = useRef<THTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [qualities, setQualities] = useState<number[]>([])
    const [selectedQuality, setSelectedQuality] = useState<number>(720)
    const [loading, setLoading] = useState<boolean>(true)
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<string>('0');
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        onLoadReactProPlayer()
    }, [src])

    useEffect(() => {
        trackPlayerPlayState()
    }, [isPlaying])

    function onLoadReactProPlayer() {
        if (!reactProPlayerRef.current) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            // setLoading(false)
            return
        }

        try {
            if (Hls.isSupported()) {
                setLoading(true)

                const hls = new Hls()
                reactProPlayerRef.current.hls = hls

                hls.loadSource(src)
                hls.attachMedia(reactProPlayerRef.current)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setQualities(hls.levels.map((level: any) => level.height))
                    setSelectedQuality(hls.levels.length - 1)
                    getVideoMetaData()
                })
            } else if (reactProPlayerRef.current.canPlayType(SUPPORTED_MIME_TYPES[0])) {
                reactProPlayerRef.current.src = src
                getVideoMetaData()
            }
        } catch (error) {
            // setLoading(false)
            console.log("hls loading error", error)
        }
    }

    /** Fetches the video's metadata from the provided source */
    function getVideoMetaData() {
        console.log('fetching video metadata...')

        if (!reactProPlayerRef.current) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            // setLoading(false)
            return
        }

        reactProPlayerRef.current.addEventListener('loadedmetadata', (metaData_: Event) => {
            if (!metaData_) {
                console.log('could fetch video metadata ❌')
                // setLoading(false)
                return
            }

            let paused_ = reactProPlayerRef.current?.paused || false

            setDuration(reactProPlayerRef.current?.duration || 0)
            setCurrentTime(reactProPlayerRef.current?.currentTime.toString() || '0')
            setIsPlaying(!paused_)
            setLoading(false)

            console.log('metadata loaded ✅', paused_)
        })
    }

    function trackPlayerPlayState() {
        if (!reactProPlayerRef.current) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            // setLoading(false)
            return
        }

        if (isPlaying) reactProPlayerRef.current.play()
        else reactProPlayerRef.current.pause()
    }

    const handleQualityChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newQuality = parseInt(event.target.value)
        const video = reactProPlayerRef.current

        setSelectedQuality(newQuality)
        // setLoading(true)

        if (!video) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            return
        }

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls

            if (hls && hls.levels[newQuality]) {
                hls.currentLevel = newQuality
                // setLoading(false)
            }
        }
    }

    const handleFullScreen = () => {
        const video = reactProPlayerRef.current

        if (!video) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            return
        }

        if (isFullScreen) {
            document.exitFullscreen();
            setIsFullScreen(false)
        } else {
            video.requestFullscreen();
            setIsFullScreen(true)
        }
    }

    const handlePlay = () => {
        const video = reactProPlayerRef.current

        if (!video) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            return
        }

        if (isPlaying) {
            video.pause()
            setIsPlaying(false)
        } else {
            video.play();
            setIsPlaying(true)
        }
    }

    const handleProgress = (event: ChangeEvent<HTMLInputElement>) => {
        const seekTime = event.target.value;

        setCurrentTime(seekTime)

        if (!reactProPlayerRef.current) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            // setLoading(false)
            return
        }

        reactProPlayerRef.current.currentTime = Number(seekTime)
    }

    const handleForwardAndRewind = (actionType: string) => {
        const video = reactProPlayerRef.current

        if (!video) {
            console.log(ERROR_MESSAGES.undefinedPlayerRef)
            return
        }

        if (actionType === "FORWARD") video.currentTime += 10
        if (actionType === "REWIND") video.currentTime -= 10
    }

    return (
        <div className={styles.reactProPlayer}>
            <div className={styles.reactProPlayerWrapper}>
                <div className={styles.reactProPlayerVideoWrapper}>
                    <video
                        ref={reactProPlayerRef}
                        poster={poster}
                        autoPlay={true}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                </div>

                {/* {!loading && <p>loading...</p>} */}
                {/* {loadingError && <p>error playing video</p>} */}

                {!loading && <div className={styles.reactProPlayerControlsWrapper}>
                    <div className={styles.reactProPlayerControls}>
                        <div className={styles.reactProPlayerControlsButtonsWrapper}>
                            <button className="fullscreen-button" onClick={handleFullScreen}>
                                {isFullScreen ? <MdFullscreen size={30} /> : <MdFullscreenExit size={30} />}
                            </button>

                            <button className="play-button" onClick={handlePlay}>
                                {isPlaying ? <BiPause size={30} /> : <BiPlay size={30} />}
                            </button>

                            <button className="play-button" onClick={() => handleForwardAndRewind("REWIND")}>
                                <MdReplay10 size={30} />
                            </button>

                            <button className="play-button" onClick={() => handleForwardAndRewind("FORWARD")}>
                                <MdOutlineForward10 size={30} />
                            </button>
                        </div>

                        <input
                            className="progress-bar"
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleProgress}
                        />

                        <div className={styles.reactProPlayerDurationQualitySelector}>
                            <p className={styles.reactProPlayerDuration}>02:23 / 22:22:34</p>
                            {qualities.length > 0 && (
                                <select value={selectedQuality} onChange={handleQualityChange}>
                                    {qualities.map((quality, index) => (
                                        <option key={index} value={index}>
                                            {quality}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ReactProPlayer