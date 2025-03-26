import React, {useEffect, useState} from 'react';
import {Pause, PlayArrow, VolumeUp, CloseSharp} from "@mui/icons-material";
import {Grid, IconButton, Typography} from "@mui/material";
import styles from "../styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import VolumeProgress from "./VolumeProgress";
import {useActions} from "../hooks/useActions";
import {useTsSelector} from "../hooks/useTsSelector";
import axios from "axios";
import {setActiveTrack} from "../store/action-creators/player";
import {API_URL} from "../http";
import {useDispatch} from "react-redux";
import {NextThunkDispatch} from "../store";

let audio;
let secs = 0;
let isFirstRender = true;

const Player = () => {
    const {pause, volume, active, duration, currentTime} = useTsSelector(state => state.player)
    const {user} = useTsSelector(state => state.user)
    const {pauseTrack, playTrack, setVolume, setCurrentTime, setDuration, hidePlayer, setUser, shouldPlayNext} = useActions()
    const [isNewTrack, setIsNewTrack] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch() as NextThunkDispatch;

    useEffect(() => {
        if(active && !isFirstRender) {
            playTrack()
        }
        isFirstRender = false;
    }, [active])

    useEffect(() => {
        return () => {
            isFirstRender = true
        }
    }, [])

    useEffect(() => {
        if(!audio) {
            audio = new Audio()
            setAudio()
        } else {
            setAudio()
        }
    }, [active])

    useEffect(() => {
        if(user) {
            if(user.listenedTracks.length !== 0) {
                user.listenedTracks.map(trackId => {
                    if(trackId == active._id) {
                        setIsNewTrack(false)
                    }
                })
            }
        }
    }, [active])

    const setAudio = () => {
        if(active) {
            audio.src = `${API_URL}/` + active.audio
            audio.volume = volume / 100
            audio.onloadeddata = () => {
                setDuration(Math.floor(audio.duration))
                setLoaded(true)
            }
            audio.ontimeupdate = () => {
                secs ++
                setCurrentTime(Math.floor(audio.currentTime))
                if(audio.currentTime == audio.duration) {
                    pauseTrack()
                    shouldPlayNext()
                }
            }
            audio.onpause = () => {
                pauseTrack()
            }
            audio.onplay = () => {
                playTrack()
            }
        }
    }

    const sendListen = async () => {
        setIsNewTrack(false)
        await axios.post(`${API_URL}/tracks/listen/` + active._id)
        const response = await axios.post(`${API_URL}/api/pushListenedTrack/${user.id}/${active._id}`)
        setUser(response.data.user);
    }

    useEffect( () => {
        if(!pause) {
            audio.play()
        } else {
            audio.pause()
            const checkListen = () => {
                if((secs >= 50 || secs == duration) && isNewTrack && user && loaded) {
                    return sendListen()
                }
            }
            if(isNewTrack) {
                checkListen()
            }
        }
    }, [pause])

    const play = () => {
        if(pause) {
            playTrack()
        } else {
            pauseTrack()
        }
    }

    const closeTrack = () => {
        audio.pause()
        pauseTrack()
        dispatch(setActiveTrack(null))
        hidePlayer()
    }

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100
        setVolume(Number(e.target.value))
    }

    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.currentTime = Number(e.target.value)
        setCurrentTime(Number(e.target.value))
    }

    return (
        <div className={styles.player}>
            <IconButton className={styles.iconButton} onClick={play}>
                {pause
                    ? <PlayArrow className={styles.icon}/>
                    : <Pause className={styles.icon}/>
                }
            </IconButton>
            <Grid container direction='column' className={styles.info}>
                <div>{active?.name.length < 30 ? active?.name : active?.name.slice(0, 29) + '...'}</div>
                <div className={styles.artist}>{active?.artist}</div>
            </Grid>
            <div className={styles.change}>
                <TrackProgress className={styles.progress} left={currentTime} right={duration} onChange={changeCurrentTime}/>
                <div className={styles.volume}>
                    <VolumeUp className={styles.volumeIcon}/>
                    <VolumeProgress className={styles.progress} left={volume} right={100} onChange={changeVolume}/>
                </div>
            </div>
            <IconButton className={styles.removeIcon} onClick={closeTrack}>
                <CloseSharp className={styles.icon}/>
            </IconButton>
        </div>
    );
};

export default Player;