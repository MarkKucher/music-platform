import React, {useEffect} from 'react';
import {ITrack} from "../types/track";
import {Box, Card, Grid, IconButton} from "@mui/material";
import TrackItem from "./TrackItem";
import {IAlbum} from "../types/album";
import {useActions} from "../hooks/useActions";
import {useTsSelector} from "../hooks/useTsSelector";
import {Delete} from "@mui/icons-material";
import axios from "axios";
import {API_URL} from "../http";
import {playTrack} from "../store/action-creators/player";
import styles from "../styles/TrackList.module.scss";

interface TrackListProps {
    tracks: ITrack[];
    loading?: boolean;
    album?: IAlbum;
    local?: boolean;
    setAlbum?: any;
}

const TrackList: React.FC<TrackListProps> = ({tracks, local, album, setAlbum, loading}) => {
    const {active} = useTsSelector(state => state.player)
    const {shouldPlayNext} = useTsSelector(state => state.playNext)
    const {setActiveTrack, shouldNotPlayNext} = useActions()

    useEffect(() => {
        if(shouldPlayNext) {
            playTrack()
        }
        shouldNotPlayNext();
    }, [active])

    useEffect(() => {
        if(shouldPlayNext) {
            const index = tracks.indexOf(active);
            const nextTrack = tracks[index + 1];
            if(nextTrack) {
                setActiveTrack(nextTrack);
            } else {
                shouldNotPlayNext()
            }
        }
    }, [shouldPlayNext])

    const removeFromAlbum = (id) => {
        return async (e) => {
            e.stopPropagation()
            await axios.post(`${API_URL}/albums/removeTrack/${album._id}/${id}`)
            setAlbum({...album, tracks: album.tracks.filter(t => t._id != id)})
        }
    }

    return (
        <Grid container direction="column">
            <Box p={2}>
                {loading ? <h1>Loading...</h1>
                    : tracks.length === 0 ? <h1>No available track</h1>
                    : tracks.map(track => track._id ?
                    <TrackItem
                        local={local}
                        key={track._id}
                        track={track}
                        album={album}
                        setAlbum={setAlbum}
                    /> : <Card className={styles.card}>
                        This track does not exist (probably it was deleted).
                        <IconButton onClick={removeFromAlbum(track)} className={styles.remove}>
                            <Delete/>
                        </IconButton>
                    </Card>
                )}
                {}
            </Box>
        </Grid>
    );
};

export default TrackList;