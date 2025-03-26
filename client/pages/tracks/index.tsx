import React, {useEffect, useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {Box, Button, Card, Grid, TextField} from "@mui/material";
import {useRouter} from "next/router";
import TrackList from "../../components/TrackList";
import {useTsSelector} from "../../hooks/useTsSelector";
import {NextThunkDispatch} from "../../store";
import {fetchTracks, searchTracks} from "../../store/action-creators/track";
import {useDispatch} from "react-redux";
import {API_URL} from "../../http";
import axios from "axios";
import {getPages, getTotalCount} from "../../utils/pages";
import Pagination from "../../components/Pagination";
import styles from "../../styles/Tracks.module.scss";

const Index = () => {
    const router = useRouter()
    const {tracks, error} = useTsSelector(state => state.track)
    const [query, setQuery] = useState<string>('')
    const dispatch = useDispatch() as NextThunkDispatch;
    const [timer, setTimer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [pages, setPages] = useState<number[]>([1])

    useEffect(() => {
        setLoading(true)
        dispatch(fetchTracks())
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        setLoading(true)
        const getTotalNumOfTracks = async () => {
            try {
                const response = await axios.get(`${API_URL}/tracks`)
                return response.data.allTracks;
            } catch (e) {
                console.log(e)
            }
        }
        setTotalPages(getTotalCount(getTotalNumOfTracks()))
        setPages(getPages(totalPages))
        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        const setPageTracks = async () => {
            let offset = (page - 1) * 10;
            await dispatch(await fetchTracks(offset))
        }
        try {
            setPageTracks()
        } finally {
            setLoading(false)
        }
    }, [page])

    const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        if(timer) {
            clearTimeout(timer)
        }
        setTimer(
            setTimeout(async () => {
                await dispatch(await searchTracks(e.target.value));
            }, 500)
        )
    }
    if (error) {
        return <MainLayout>
            <h1>{error}</h1>
        </MainLayout>
    }

    return (
        <MainLayout title={"Track list - music platform"}>
            <Grid container justifyContent='center'>
                <Card className={styles.card}>
                    <Box p={3}>
                        <Grid container justifyContent='space-between'>
                            <h1 className={styles.title}>Track list</h1>
                            <Button onClick={() => router.push('/tracks/create')}>
                                Download
                            </Button>
                        </Grid>
                    </Box>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={search}
                        label={'Search track'}
                    />
                    <TrackList loading={loading} tracks={tracks} local={false}/>
                </Card>
                {!loading && <Pagination totalPages={pages} page={page} setPage={setPage}/>}
            </Grid>
        </MainLayout>
    );
};

export default Index;