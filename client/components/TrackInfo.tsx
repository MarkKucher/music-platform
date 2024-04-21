import React, {useEffect, useState} from 'react';
import MainLayout from "../layouts/MainLayout";
import {Box, Button, Grid, IconButton, TextField} from "@mui/material";
import {API_URL} from "../http";
import styles from "../styles/DetailTrack.module.scss";
import ActivateMessage from "./ActivateMessage";
import {Favorite, FavoriteBorder, Pause, PlayArrow} from "@mui/icons-material";
import Timer from "./Timer";
import AddToAlbum from "./AddToAlbum";
import Accordion from "./MyAccordion";
import CommentList from "./CommentList";
import MyModal from "./MyModal";
import AlbumList from "./AlbumList";
import axios from "axios";
import AuthService from "../services/AuthService";
import {useTsSelector} from "../hooks/useTsSelector";
import {useActions} from "../hooks/useActions";
import {ITrack} from "../types/track";
import {useRouter} from "next/router";

interface TrackInfoProps {
    serverTrack: ITrack;
}

const TrackInfo: React.FC<TrackInfoProps> = ({serverTrack}) => {
    const {pause, duration, currentTime, active, hide} = useTsSelector(state => state.player)
    const {user, isAuth} = useTsSelector(state => state.user)
    const {selectedAlbums} = useTsSelector(state => state.selectedAlbums)
    const {pauseTrack, playTrack, setActiveTrack, showPlayer, setUser, PushSelectedAlbum} = useActions()
    const [track, setTrack] = useState<ITrack>(serverTrack)
    const router = useRouter()
    const [text, setText] = useState('');
    const [albums, setAlbums] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isPermitted, setIsPermitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [trackDuration, setTrackDuration] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log(albums)
    }, [albums])

    useEffect(() => {
        showPlayer()
    }, [])

    useEffect(() => {
        duration !== 0 && setTrackDuration(duration)
    }, [duration])

    useEffect(() => {
        if(!modal) {
            PushSelectedAlbum([])
        }
    }, [modal])

    useEffect(() => {
        setActiveTrack(track)
        if(user) {
            if(user.likedTracks.length !== 0) {
                if(active) {
                    if(user.likedTracks.includes(active._id)) {
                        setIsLiked(true)
                    }
                }
            }
        }
        if(active) {
            setTrack(active)
        }
    }, [active])

    useEffect(() => {
        if(user) {
            if(user.isActivated && isAuth) {
                setIsPermitted(true)
            }
        }
    }, [user])

    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    const sendLike = async () => {
        if(isLiked) {
            await axios.post(`${API_URL}/tracks/decrementLike/` + track._id)
            const response = await AuthService.removeLikedTrack(user.id, track._id)
            setUser(response.data.user)
            setTrack({...track, likes: track.likes - 1})
            setIsLiked(false)
        } else if(!isLiked) {
            await axios.post(`${API_URL}/tracks/incrementLike/` + track._id)
            const response = await AuthService.pushLikedTrack(user.id, track._id)
            setUser(response.data.user)
            setTrack({...track, likes: track.likes + 1})
            setIsLiked(true)
        }
    }


    const play = () => {
        if(!active) {
            setActiveTrack(track)
            showPlayer()
        }
        if(pause) {
            if(hide) {
                showPlayer()
            }
            if(!active) {
                setActiveTrack(track)
            }
            playTrack()
        } else {
            pauseTrack()
        }
    }

    const addComment = async () => {
        try {
            if(text !== '') {
                const response = await axios.post(`${API_URL}/tracks/comment`, {
                    username: user.name,
                    text: text,
                    userId: user.id,
                    trackId: track._id
                })
                setTrack({...track, comments: [response.data, ...track.comments]})
                setText('')
            } else {
                alert('Field is empty')
            }
        } catch (e) {
            console.log(e)
        }
    }

    const addTrack = async () => {
        setModal(false)
        await Promise.all(selectedAlbums.map(async (alb) => {
            const response = await axios.post(`${API_URL}/albums/addTrack/${alb._id}/${track._id}`)
            alb.tracks.push(response.data)
        }))
        PushSelectedAlbum([])
    }

    useEffect(() => {
        const fetchAlbums = async () => {
            if(user) {
                const response = await axios.get(`${API_URL}/albums/${user.id}`)
                setAlbums(response.data)
            }
        }
        try {
            setLoading(true)
            fetchAlbums()
        } finally {
            setLoading(false)
        }
    }, [user])

    return (
        <MainLayout
            title={"music platform - " + track.name + " - " + track.artist}
            keywords={'Music, Artist, ' + track.name + ", " + track.artist}
        >
            <Grid container className={styles.info}>
                <div className={styles.track}>
                    <img alt={"song cover"} src={`${API_URL}/` + track.picture} width={240} height={200}/>
                    <hr className={styles.separateLine}></hr>
                    {!isPermitted && <ActivateMessage/>}
                    <div className={styles.miniPlayer}>
                        <IconButton onClick={sendLike} disabled={!isPermitted}>
                            {!isLiked ? <FavoriteBorder/> : <Favorite/>}
                        </IconButton>
                        <IconButton onClick={play}>
                            {pause
                                ? <PlayArrow/>
                                : <Pause/>
                            }
                        </IconButton>
                        <div>
                            {Timer(currentTime | 0, trackDuration)}
                        </div>
                        <AddToAlbum setModal={setModal} disabled={!isPermitted}/>
                    </div>
                    <hr className={styles.separateLine}></hr>
                    <Button
                        variant={"outlined"}
                        className={styles.backButton}
                        onClick={() => router.push('/tracks')}
                    >
                        Back to the list
                    </Button>
                </div>
                <Grid className={styles.details}>
                    <h2>Track name - {track.name}</h2>
                    <h2>Artist - {track.artist}</h2>
                    <h2>{Timer(null, trackDuration)}</h2>
                    <h2>Listens - {track.listens}</h2>
                    <h2>Likes - {track.likes}</h2>
                </Grid>
            </Grid>
            <div className='.accordion'>
                <Accordion title='Text' text={track.text}/>
            </div>
            <h1>Create comment</h1>
            {!isPermitted && <ActivateMessage/>}
            <Grid container>
                <TextField
                    disabled={!isPermitted}
                    label="Comment"
                    value={text}
                    onChange={onChangeText}
                    fullWidth
                    multiline
                    rows={3}
                />
                <Button onClick={addComment}>Send</Button>
            </Grid>
            <div>
                <CommentList comments={track.comments}/>
            </div>
            <MyModal visible={modal} setVisible={setModal}>
                <Box className={styles.modal__container}>
                    <div className={styles.modal__content}>
                        <h2>Select albums</h2>
                        <p className={styles.selected}>{selectedAlbums && selectedAlbums.length}</p>
                    </div>
                    {loading ? <h2>Loading...</h2>
                        : albums ? <AlbumList
                                close={!modal}
                                albums={albums.filter(alb => !alb.favorite && !alb.tracks.includes(serverTrack._id))}
                                setAlbums={null}
                                offer={true}
                            />
                            : <h2>No available albums</h2>
                    }
                    {selectedAlbums.length > 0 && <Button onClick={addTrack}>Add</Button>}
                </Box>
            </MyModal>
            <style jsx>
                {`
                  .accordion {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
}
                `}
            </style>
        </MainLayout>
    )
};

export default TrackInfo;