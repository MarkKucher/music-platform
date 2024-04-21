import React, {useEffect, useState} from 'react';
import {Box, Button, Card, Grid} from "@mui/material";
import styles from "../styles/DetailAlbum.module.scss";
import TrackList from "./TrackList";
import MainLayout from "../layouts/MainLayout";
import {useRouter} from "next/router";
import {IAlbum} from "../types/album";
import {ITrack} from "../types/track";
import axios from "axios";
import {API_URL} from "../http";
import {useTsSelector} from "../hooks/useTsSelector";

interface AlbumInfoProps {
    serverAlbum: IAlbum;
}


const AlbumInfo: React.FC<AlbumInfoProps> = ({serverAlbum}) => {
    const [album, setAlbum] = useState<IAlbum>(serverAlbum)
    const [tracks, setTracks] = useState<ITrack[]>([])
    const router = useRouter()

    useEffect(() => {
        const getCertainTrack = async () => {
            const response = await axios.get(`${API_URL}/albums/getAlbumTracks/${album._id}`)
            const data = response.data.map((t, i) => t ? t : album.tracks[i])
            setTracks(data)
        }

        if(album.tracks) {
            getCertainTrack()
        }
    }, [])

    return (
        <MainLayout title={"Album: " + album.title}>
            <Grid container justifyContent="center">
                <Card sx={{minWidth: '90%'}}>
                    <Box className={styles.topInfo}>
                        <div className={album.favorite ? `${styles.favoriteInfo} ${styles.boxSize}` : `${styles.boxSize}`}>
                            <div className={styles.albInfo}>
                                <h1 className={styles.title}>{album.title}</h1>
                                <p className={styles.subInfo}>
                                    tracks - {album.tracks.length}
                                </p>
                            </div>
                            <Button onClick={() => router.push('/albums')}>
                                Back to the albums
                            </Button>
                        </div>
                    </Box>
                    {tracks.length !== 0 ?
                        <TrackList
                            tracks={tracks}
                            local={true}
                            album={album}
                            setAlbum={setAlbum}
                        />
                        : <h1>This album is empty</h1>
                    }
                </Card>
            </Grid>
        </MainLayout>
    );
};

export default AlbumInfo;