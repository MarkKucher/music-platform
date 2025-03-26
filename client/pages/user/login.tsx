import React, {useState} from 'react';
import styles from "../../styles/Login.module.scss";
import {Box, Button, Card, Grid, Link, TextField} from "@mui/material";
import {useActions} from "../../hooks/useActions";
import MainLayout from "../../layouts/MainLayout";
import AuthService from "../../services/AuthService";
import {setAuth} from "../../store/action-creators/user";
import {useRouter} from "next/router";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMassage";
import axios from "axios";
import {API_URL} from "../../http";
import MyModal from "../../components/MyModal";
import {useInput} from "../../hooks/useInput";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState('')
    const [modalError, setModalError] = useState('')
    const {setUser, setAuth} = useActions()
    const [shouldShowMessage, setShouldShowMessage] = useState(false)
    const modalEmail = useInput('')
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    const sendForgotPassword = async () => {
        try {
            if(!modalEmail.value.trim()) {
                setModalError('Write email')
                return;
            }
            const {data} = await axios.get(`${API_URL}/api/getUserIdByEmail/${modalEmail.value}`)
            localStorage.setItem('candidateId', data)
            await axios.post(`${API_URL}/api/forgotPassword`, {email: modalEmail.value})
            setShouldShowMessage(true)
            setTimeout(() => {
                router.push('/tracks')
            }, 4000)
            setModalError('')
        } catch (e) {
            setModalError(e.response?.data?.message)
        }
    }

    const login = async (email, password) => {
        try {
            if(!email.trim() || !password.trim()) {
                setError('Write email and password')
                return null;
            }
            if(password.length < 8 || password.length > 16) {
                setError("Password can't be shorter than 8 letters or longer than 16")
                return null;
            }
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            setUser(response.data.user);
            setAuth();
            if(error) {
                setError('')
            }
            await router.push('/tracks')
        } catch (e) {
            setError(e.response?.data?.message)
        }
    }

    return (
        <MainLayout>
            <Grid container justifyContent="center" className={styles.main}>
                {shouldShowMessage && <InfoMessage text={'Link that allows you change password was sent on your email'}/>}
                <Card className={styles.card}>
                    <Grid container direction={"column"} className={styles.form}>
                        <TextField
                            type="text"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            label={'Email'}
                            className={styles.field}
                        />
                        <TextField
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            label={'Password'}
                            className={styles.field}
                        />
                        {error != '' && <ErrorMessage text={error}/>}
                        <Grid container justifyContent="space-between" className={styles.footer}>
                            <div className={styles.option}>
                                <Button variant={'outlined'} onClick={async () => {await login(email, password)}}>Log in</Button>
                                <Link className={styles.pointer} onClick={() => {setShowModal(true)}}>Forgot password?</Link>
                            </div>
                            <Link href="/user/registration">Or register</Link>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <MyModal visible={showModal} setVisible={setShowModal}>
                <Box>
                    <Grid container direction="column">
                        {modalError != '' && <ErrorMessage text={modalError}/>}
                        <TextField
                            className={styles.modal__field}
                            {...modalEmail}
                            label="Email"/>
                        <Button variant="outlined" onClick={sendForgotPassword} className={styles.modal__button}>Send link on email</Button>
                    </Grid>
                </Box>
            </MyModal>
        </MainLayout>
    );
};

export default Login;