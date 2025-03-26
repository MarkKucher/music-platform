import React, {useEffect, useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {useTsSelector} from "../../hooks/useTsSelector";
import ActivateMessage from "../../components/ActivateMessage";
import {Box, Button, Card, Grid, TextField} from "@mui/material";
import MyModal from "../../components/MyModal";
import {useInput} from "../../hooks/useInput";
import axios from "axios";
import {API_URL} from "../../http";
import AlbumList from "../../components/AlbumList";
import {IAlbum} from "../../types/album";
import styles from "../../styles/AlbumsPage.module.scss";

const Index = () => {
    const {user} = useTsSelector(state => state.user)
    const [albums, setAlbums] = useState<IAlbum[]>([])
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const title = useInput('')

    const createAlbum = async (e) => {
        if(title.value == '') {
            alert('Write album title')
        }
        e.stopPropagation()
        const response = await axios.post(`${API_URL}/albums/create`, {title: title.value, userId: user.id})
        albums.push(response.data)
        title.setValue('')
        setModal(false)
    }

    useEffect(() => {
        setLoading(true)
    }, [])

    useEffect(() => {
        const fetchAlbums = async () => {
            const response = await axios.get(`${API_URL}/albums/${user.id}`)
            setAlbums(response.data)
        }
        try{
            if(user) {
                fetchAlbums()
            }
        } finally {
            setLoading(false)
        }
    }, [user])

    if(loading) {
        return (
            <MainLayout>
                <h1>Loading...</h1>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="albums">
            <Grid className={"grid"} container justifyContent='center'>
                <Card className={styles.card}>
                    <Box p={3}>
                        <Grid container justifyContent='space-between'>
                            <h1>Albums</h1>
                            <div>
                                {!user && <ActivateMessage/>}
                                <Button variant="outlined" onClick={() => setModal(true)} disabled={!user} className={styles.createButton}>
                                    Create album
                                </Button>
                            </div>
                        </Grid>
                    </Box>
                    <AlbumList close albums={albums} setAlbums={setAlbums} offer={false}/>
                </Card>
            </Grid>
            <MyModal visible={modal} setVisible={setModal}>
                <Box>
                    <Grid container direction="column">
                        <TextField
                            {...title}
                            label="Album title"/>
                        <Button variant="outlined" onClick={e => createAlbum(e)} className={styles.confirmButton}>
                            Create album
                        </Button>
                    </Grid>
                </Box>
            </MyModal>
        </MainLayout>
    );
};


export default Index;