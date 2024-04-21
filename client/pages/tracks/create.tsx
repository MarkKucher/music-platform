import React, {useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import StepWrapper from "../../components/StepWrapper";
import {Button, Card, Grid, TextField} from "@mui/material";
import FileUpload from "../../components/FileUpload";
import {useInput} from "../../hooks/useInput";
import {useRouter} from "next/router";
import axios from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import {API_URL} from "../../http";
import {useTsSelector} from "../../hooks/useTsSelector";
import styles from "../../styles/CreateTrack.module.scss";

const Create = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [picture, setPicture] = useState(null)
    const [audio, setAudio] = useState(null)
    const [error, setError] = useState('')
    const {user} = useTsSelector(state => state.user)
    const name = useInput('')
    const artist = useInput('')
    const text = useInput('')
    const [isSending, setIsSending] = useState<boolean>(false)
    const router = useRouter()

    const next = () => {
        if (activeStep !== 2) {
            setActiveStep(prev => prev + 1)
        } else {
            if(artist.value.length < 1 || name.value.length < 1) {
                setError("Track can't have an empty name or artist")
                return null;
            }
            if(!audio) {
                setError('Track must have audio')
                return null;
            }
            if(!picture) {
                setError('Track must have picture')
                return null;
            }
            if(!user.isActivated) {
                setError('You must activate account to upload track')
                return null;
            }
            const formData = new FormData()
            formData.append('name', name.value)
            formData.append('text', text.value)
            formData.append('artist', artist.value)
            formData.append('picture', picture)
            formData.append('audio', audio)
            formData.append('userId', user.id)
            if(error) {
                setError('')
            }
            setIsSending(true)
            axios.post(`${API_URL}/tracks`, formData)
                .then(() => {router.push('/tracks')})
                .catch(e => {
                    console.log(e)
                    setError(e.message)
                })
        }
    }
    const back = () => {
        if(activeStep == 0){
            router.push('/tracks')
        } else {
            setActiveStep(prev => prev - 1);
        }
    }

    return (
        <MainLayout>
            <StepWrapper activeStep={activeStep}>
                {activeStep === 0 &&
                    <Grid container direction={"column"} className={styles.form}>
                        <TextField
                            required
                            {...name}
                            className={styles.field}
                            label={"Track title"}
                        />
                        <TextField
                            required
                            {...artist}
                            className={styles.field}
                            label={"Artist"}
                        />
                        <TextField
                            {...text}
                            className={styles.field}
                            label={"Track's text"}
                            multiline
                            rows={3}
                        />
                    </Grid>
                }
                {activeStep === 1 &&
                    <FileUpload setFile={setPicture} accept="image/*">
                        <div className={styles.box}>
                            <Button>Download track cover</Button>
                            {picture && <h3 className={styles.success}>Downloaded</h3>}
                        </div>
                    </FileUpload>
                }
                {activeStep === 2 &&
                    <FileUpload setFile={setAudio} accept="audio/*">
                        {error != '' && <ErrorMessage text={error}/>}
                        <div className={styles.box}>
                            <Button>Download track</Button>
                            {audio && <h3 className={styles.success}>Downloaded</h3>}
                        </div>
                    </FileUpload>
                }
            </StepWrapper>
            <Grid container justifyContent='space-between'>
                <Button disabled={activeStep == -1} onClick={back}>{activeStep == 0 ? 'Back to the list' : 'Back'}</Button>
                {isSending && <Card className={styles.card}>Posting track...</Card>}
                <Button disabled={activeStep == 3} onClick={next}>{activeStep == 2 ? 'Download' : 'Next'}</Button>
            </Grid>
        </MainLayout>
    );
};

export default Create;

