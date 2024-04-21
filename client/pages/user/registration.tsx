import React, {useEffect, useState} from 'react';
import {Button, Card, Grid, Link, TextField} from "@mui/material";
import {useActions} from "../../hooks/useActions";
import MainLayout from "../../layouts/MainLayout";
import AuthService from "../../services/AuthService";
import {useRouter} from "next/router";
import {useTsSelector} from "../../hooks/useTsSelector";
import {setUser} from "../../store/action-creators/user";
import ErrorMessage from "../../components/ErrorMessage";
import InfoMessage from "../../components/InfoMassage";
import styles from "../../styles/Registration.module.scss";

const Registration: React.FC = () => {
    const {isAuth} = useTsSelector(state => state.user)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState(null)
    const [shouldShowMessage, setShouldShowMessage] = useState<boolean>(false)
    const {setUser, setAuth} = useActions()
    const router = useRouter()

    useEffect(() => {
        if(error === '') {
            setShouldShowMessage(true)
            setTimeout(() => {
                router.push('/tracks')
            }, 4000)
        }
    }, [error])

    const register = async (name, email, password) => {
        try {
            if(isAuth) {
                setError('You already have account')
                return null;
            }
            if(!email.trim() || !password.trim() || !name.trim()) {
                setError('Write email, password and your username')
                return null;
            }
            if(name.length < 3) {
                setError('Name should not be shorter than 3 letters')
                return null;
            }
            if(password.length < 8 || password.length > 16) {
                setError("Password can't be shorter than 8 letters or longer than 16")
                return null;
            }
            const response = await AuthService.registration(name, email, password);
            localStorage.setItem('token', response.data.accessToken);
            setUser(response.data.user);
            setAuth();
            setError('')
        } catch (e) {
            setError(e.response?.data?.message)
        }
    }

    return (
        <MainLayout>
            <Grid container justifyContent="center" className={styles.main}>
                {shouldShowMessage && <InfoMessage text={'Confirmation link was sent on your email. Open it to activate your account.'}/>}
                <Card className={styles.card}>
                    <Grid container direction={"column"} className={styles.form}>
                        <TextField
                            onChange={e => setName(e.target.value)}
                            value={name}
                            type={"text"}
                            required
                            className={styles.field}
                            label={"Username"}
                        />
                        <TextField
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            type={"text"}
                            required
                            className={styles.field}
                            label={"Email"}
                        />
                        <TextField
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            type={"password"}
                            required
                            className={styles.field}
                            label={"Password"}
                        />
                        {error != '' && <ErrorMessage text={error}/>}
                        <Grid container justifyContent="space-between" className={styles.footer}>
                            <Button variant={'outlined'} onClick={async () => await register(name, email, password)}>Register</Button>
                            <Link href="/user/login">Or login</Link>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </MainLayout>
    );
};

export default Registration;