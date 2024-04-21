import React from 'react';
import {useTsSelector} from "../../hooks/useTsSelector";
import {useRouter} from "next/router";
import {Button, Grid} from "@mui/material";
import styles from "../../styles/Profile.module.scss";
import MainLayout from "../../layouts/MainLayout";

const Profile = () => {
    const {user} = useTsSelector(state => state.user)
    const router = useRouter()

    return (
        <MainLayout>
            {!user ?
                <h1>Loading...</h1>
                :
                <Grid className={styles.list}>
                    <h2>Username - {user.name}</h2>
                    <h2>Email - {user.email}</h2>
                    <h2>Liked tracks - {user.likedTracks.length}</h2>
                    <h2>Listened tracks - {user.listenedTracks.length}</h2>
                    <h2>Albums - {user.albums.length}</h2>
                    <Button variant="outlined" onClick={() => router.push('/user/setpicture')}>Change picture</Button>
                    <Button className={styles.last} variant="outlined" onClick={() => router.push('/user/settings')}>Settings</Button>
                </Grid>
            }
        </MainLayout>
    );
};

export default Profile;