import React, {useEffect, useState} from 'react';
import {ITrack} from "../types/track";
import {Card, Grid, IconButton, Typography} from "@mui/material";
import styles from "../styles/TrackItem.module.scss";
import {Pause, PlayArrow, Delete, CloseSharp} from "@mui/icons-material";
import {useRouter} from "next/router";
import {useActions} from "../hooks/useActions";
import axios from "axios";
import {useTsSelector} from "../hooks/useTsSelector";
import Timer from "./Timer";
import {hidePlayer} from "../store/action-creators/player";
import {API_URL} from "../http";
import {IAlbum} from "../types/album";
import {NextThunkDispatch} from "../store";
import {useDispatch} from "react-redux";
import {setTracks} from "../store/action-creators/track";


interface TrackItemProps {
    track: ITrack;
    album?: IAlbum;
    local?: boolean;
    setAlbum: any;
}

const edge = 570;

const TrackItem: React.FC<TrackItemProps> = ({track, local, album, setAlbum}) => {
    const router = useRouter();
    const {pause, active, duration, currentTime, hide} = useTsSelector(state => state.player);
    const {tracks} = useTsSelector(state => state.track);
    const {user} = useTsSelector(state => state.user);
    const dispatch = useDispatch() as NextThunkDispatch;
    const [width, setWidth] = useState(window.innerWidth);

    const {playTrack, pauseTrack, setActiveTrack, showPlayer} = useActions()

    let onResize = (e) => {
        setWidth(e.target.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize, {passive: true})
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    const play = (e) => {
        e.stopPropagation()
        if(!active || active._id !== track._id) {
            pauseTrack()
            setActiveTrack(track)
        }
        if(hide) {
            showPlayer()
        }
        if(pause) {
            playTrack()
        } else {
            pauseTrack()
        }
    }

    const deleteTrack = async (e) => {
        e.stopPropagation()
        hidePlayer()
        await axios.delete(`${API_URL}/tracks/${track._id}`)
        dispatch(setTracks(tracks.filter(t => t._id !== track._id)))
    }

    const removeFromAlbum = async (e) => {
        e.stopPropagation()
        if(album.favorite) {

        } else {
            await axios.post(`${API_URL}/albums/removeTrack/${album._id}/${track._id}`)
        }
        dispatch(setAlbum({...album, tracks: album.tracks.filter(t => t._id != track._id)}))
    }

    const Redirect = () => {
        dispatch(pauseTrack())
        dispatch(hidePlayer())
        setActiveTrack(null)
        router.push('/tracks/' + track._id)
    }

    return (
        <Card className={styles.track} onClick={Redirect}>
            <IconButton onClick={play}>
                {active?._id != track._id ? <PlayArrow/> : pause
                    ? <PlayArrow/>
                    : <Pause/>
                }
            </IconButton>
            <Grid>
                <img alt={"song cover"} width={width > edge ? 70 : 50} height={width > edge ? 70 : 50} src={`${API_URL}/${track.picture}`} className={styles.cover}/>
            </Grid>
            <Grid container direction='column' className={styles.title}>
                <div>{track.name.length < 30 ? track.name : track.name.slice(0, 29) + '...'}</div>
                <div className={styles.subInfo}>{track.artist}</div>
            </Grid>
            {width > edge && <div className={styles.info}>
                <div className={styles.subInfo}>listens - {track.listens}</div>
                <div className={styles.subInfo}>likes - {track.likes}</div>
            </div>}
            {active && active._id == track._id && width > edge && <Grid className={styles.timer}>{Timer(currentTime, duration)}</Grid>}
            {!album?.favorite && user?.id === track.userId ? !local ?
                <IconButton onClick={deleteTrack} className={styles.remove}>
                    <Delete/>
                </IconButton>
                :
                <IconButton onClick={removeFromAlbum} className={styles.remove}>
                    <CloseSharp/>
                </IconButton>
                : <></>
            }
        </Card>
    );
};

export default TrackItem;