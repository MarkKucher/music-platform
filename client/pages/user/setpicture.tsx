import React, {useEffect, useState} from 'react';
import styles from "../../styles/SetPicture.module.scss";
import MainLayout from "../../layouts/MainLayout";
import {Box, Button, Grid} from "@mui/material";
import FileUpload from "../../components/FileUpload";
import {useRouter} from "next/router";
import axios from "axios";
import {useTsSelector} from "../../hooks/useTsSelector";
import {useActions} from "../../hooks/useActions";
import {UserDto} from "../../models/UserDto";
import {API_URL} from "../../http";

const SetPicture: React.FC = () => {
    const {user} = useTsSelector(state => state.user)
    const router = useRouter()
    const [picture, setPicture] = useState(null)
    const {setUser} = useActions()

    const defaultPicture = async (user: UserDto) => {
        const response = await axios.post(`${API_URL}/api/setDefaultPicture/${user.id}`)
        setUser(response.data.user)
        await router.push('')
    }

    useEffect(() => {
        const confirmChange = async () => {
            const formData = new FormData()
            formData.append('picture', picture)
            const response = await axios.post(`${API_URL}/api/user/${user.id}`, formData)
            setUser(response.data.user)
            await router.push('/tracks')
            console.log(user)
        }
        picture && confirmChange()
    }, [picture])

    return (
        <MainLayout>
            <Box className={styles.container}>
                <h1 className={styles.title}>Change profile icon</h1>
                <Grid container justifyContent='space-between'>
                    <Button variant="outlined" onClick={async () => await defaultPicture(user)}>Set default icon</Button>
                    <FileUpload setFile={setPicture} accept="image/*">
                        <Button variant="outlined">Set image</Button>
                    </FileUpload>
                </Grid>
            </Box>
        </MainLayout>
    );
};

export default SetPicture;