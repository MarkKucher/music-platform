import React, {useEffect, useState} from 'react';
import styles from "../styles/User.module.scss"
import {useActions} from "../hooks/useActions";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import {useTsSelector} from "../hooks/useTsSelector";
import {Button} from "@mui/material";
import {useRouter} from "next/router";
import UserMenu from "./UserMenu";

const User: React.FC = () => {

    const [loading, setLoading] = useState(false)
    const {user, isAuth} = useTsSelector(state => state.user)
    const {setAuth, setUser} = useActions()

    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 8000)
            try {
                const response = await axios.get<AuthResponse>(`${API_URL}/api/refresh`, {withCredentials: true})
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setAuth()
            } catch (e) {
                console.log(e.message);
            } finally {
                setLoading(false)
            }
        }

        if(localStorage.getItem('token')) {
            checkAuth()
        }
    }, [])

    if(loading) {
        return (
            <div className={styles.mainDiv}>
                <h2>Loading...</h2>
            </div>
        );

    }

    return (
        <div className={styles.mainDiv}>
            {!isAuth ? <Button onClick={() => router.push('/user/login')}>Sign in</Button> : <UserMenu user={user}/>}
        </div>
    );
};

export default User;