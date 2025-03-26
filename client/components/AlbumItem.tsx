import React, {useEffect, useState} from 'react';
import {Card, Grid, IconButton} from "@mui/material";
import {IAlbum} from "../types/album";
import {useRouter} from "next/router";
import styles from "../styles/AlbumItem.module.scss";
import {Delete} from "@mui/icons-material";
import axios from "axios";
import {API_URL} from "../http";
import {useActions} from "../hooks/useActions";
import {useTsSelector} from "../hooks/useTsSelector";

interface AlbumItemProps {
    album: IAlbum;
    favorite?: boolean;
    albums?: IAlbum[];
    setAlbums?: any;
    offer?: boolean;
    close?: boolean;
}

const AlbumItem: React.FC<AlbumItemProps> = ({album,favorite, albums, setAlbums, offer, close}) => {
    const router = useRouter();
    const {user} = useTsSelector(state => state.user);
    const {selectedAlbums} = useTsSelector(state => state.selectedAlbums)
    const [selected, setSelected] = useState(false);
    const {PushSelectedAlbum, RemoveSelectedAlbum} = useActions()

    useEffect(() => {
        if(close) {
            setSelected(false)
        }
    }, [close])

    const deleteAlbum = async (e) => {
        e.stopPropagation()
        await axios.delete(`${API_URL}/albums/${album._id}`);
        setAlbums(albums.filter(alb => alb._id != album._id))
    }

    const GeneralClick = async () => {
        if(offer) {
            if(!selected) {
                setSelected(true)
                selectedAlbums.push(album)
                PushSelectedAlbum(selectedAlbums)
            } else {
                setSelected(false)
                RemoveSelectedAlbum(selectedAlbums.filter(alb => alb._id != album._id))
            }
        } else {
            await router.push('/albums/' + album._id)
        }
    }

    return (
        <Card className={album.favorite ? `${styles.favoriteInfo}` : !selected ? `${styles.album}` : `${styles.albumActive}`} onClick={GeneralClick}>
            <Grid container direction='column' className={styles.info}>
                <div>{album.title}</div>
                <div className={styles.length}>tracks - {album.tracks.length}</div>
            </Grid>
            {(!offer && !favorite)
                && <IconButton onClick={e => deleteAlbum(e)} className={styles.deleteIcon}>
                        <Delete/>
                    </IconButton>
            }
        </Card>
    );
};

export default AlbumItem;