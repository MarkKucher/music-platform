import React, {useEffect, useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {Grid, Button, TextField, Box, Link} from "@mui/material";
import styles from "../../styles/Settings.module.scss";
import {useTsSelector} from "../../hooks/useTsSelector";
import MyModal from "../../components/MyModal";
import {useInput} from "../../hooks/useInput";
import axios from "axios";
import {API_URL} from "../../http";
import {useActions} from "../../hooks/useActions";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMassage";

const Settings: React.FC = () => {
    const [error, setError] = useState('');
    const {user} = useTsSelector(state => state.user);
    const {setUser} = useActions();
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [verified, setVerified] = useState(false);
    const username = useInput('')
    const password = useInput('')
    const [shouldShowMessage, setShouldShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const checkRedirected = async () => {
            const response = await axios.get(`${API_URL}/api/passwordCheck`)
            if(response.data == true) {
                setVerified(true)
                setShowPasswordModal(true)
            }
        }
        checkRedirected()
    }, [])

    useEffect(() => {
        if(!showUsernameModal) {
            username.setValue('')
        }
    }, [showUsernameModal])

    useEffect(() => {
        if(!showPasswordModal) {
            password.setValue('')
            setError('')
        }
    }, [showPasswordModal])

    const changeUsername = async () => {
        const response = await axios.post(`${API_URL}/api/changeUsername/${user.id}`, {username: username.value});
        setUser(response.data.user);
        username.setValue('')
        setShowUsernameModal(false)
    }

    const sendForgotPassword = async () => {
        await axios.post(`${API_URL}/api/forgotPassword`, {email: user.email})
        setShowPasswordModal(false)
        setMessage('Link that allows you to change password was sent on your email')
        setShouldShowMessage(true)
        setTimeout(() => {
            setShouldShowMessage(false)
        }, 4000)
    }

    const verifyPassword = async () => {
        if(password.value.length < 8 || password.value.length > 16) {
            setError("Password can't be shorter than 8 letters or longer than 16")
            return null;
        }
        if(!user) {
            setError('You are not registered')
            return;
        }
        try {
            await axios.post(`${API_URL}/api/verifyPassword/${user.id}`, {password: password.value});
            setVerified(true)
            password.setValue('')
            setShowPasswordModal(false)
            setShowPasswordModal(true)
        } catch (e) {
            setError('Wrong password')
            password.setValue('')
        }
    }

    const changePassword = async () => {
        if(password.value.length < 8 || password.value.length > 16) {
            setError("Password can't be shorter than 8 letters or longer than 16")
            return null;
        }
        const id = user ? user.id : localStorage.getItem('candidateId')
        if(!id) {
            setError("You are not registered")
            return;
        }
        const response = await axios.post(`${API_URL}/api/changePassword/${id}`, {password: password.value});
        password.setValue('')
        setShowPasswordModal(false)
        if(response) {
            localStorage.removeItem('candidateId')
            setMessage('Your password have been changed')
            setShouldShowMessage(true)
            setTimeout(() => {
                setShouldShowMessage(false)
            }, 4000)
        }
        setVerified(false)
    }

    return (
        <MainLayout>
            {shouldShowMessage && <InfoMessage text={message}/>}
            {user &&
                <Grid flexDirection={'column'} className={styles.list}>
                    <h1>Settings</h1>
                    <Button className={styles.option} variant="outlined" onClick={() => setShowUsernameModal(true)}>Change username</Button>
                    <Button className={styles.option} variant="outlined" onClick={() => setShowPasswordModal(true)}>Change password</Button>
                </Grid>
            }
            <MyModal visible={showUsernameModal} setVisible={setShowUsernameModal}>
                <Box>
                    <Grid container direction="column">
                        <TextField
                            {...username}
                            label="New username"/>
                        <Button variant="outlined" onClick={changeUsername} className={styles.button}>Confirm change</Button>
                    </Grid>
                </Box>
            </MyModal>
            <MyModal visible={showPasswordModal} setVisible={setShowPasswordModal}>
                <Box>
                    {!verified ?
                        <Grid container direction="column">
                            <h2 className={styles.title}>Write current password to verify your identity</h2>
                            <TextField
                                type="password"
                                className={styles.field}
                                {...password}
                                label="Current password"/>
                            {error != '' && <ErrorMessage text={error}/>}
                            <Button className={styles.marginTop} variant="outlined" onClick={verifyPassword}>Verify</Button>
                            <Link className={styles.marginTop + ' ' + styles.link} onClick={sendForgotPassword}>Forgot password?</Link>
                        </Grid>
                        :
                        <Grid container direction="column">
                            <h2 className={styles.title}>Write new password</h2>
                            <TextField
                                type="password"
                                className={styles.field}
                                {...password}
                                label="New password"/>
                            {error != '' && <ErrorMessage text={error}/>}
                            <Button variant="outlined" onClick={changePassword} className={styles.button}>Confirm change</Button>
                        </Grid>
                    }
                </Box>
            </MyModal>
        </MainLayout>
    );
};

export default Settings;