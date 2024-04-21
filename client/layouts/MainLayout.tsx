import React, {useEffect} from 'react';
import Navbar from "../components/Navbar";
import {Container} from "@mui/material";
import Player from "../components/Player";
import Head from "next/head";
import {useTsSelector} from "../hooks/useTsSelector";
import styles from "../styles/MainLayout.module.scss";
import {hidePlayer, setActiveTrack} from "../store/action-creators/player";
import {NextThunkDispatch} from "../store";
import {useDispatch} from "react-redux";

interface MainLayoutProps {
    title?: string;
    description?: string;
    keywords?: string;

}

const MainLayout: React.FC<MainLayoutProps>
    = ({
           children,
           title,
           description,
           keywords
       }) => {

    const {hide} = useTsSelector(state => state.player)
    const dispatch = useDispatch() as NextThunkDispatch;

    useEffect(() => {
        dispatch(hidePlayer())
        dispatch(setActiveTrack(null))
    }, [])

    return (
        <div className={styles.layout}>
            <Head>
                <title>{title || 'Music platform'}</title>
                <meta name="description" content={`Music platform` + description}/>
                <meta name="robots" content="index, follow"/>
                <meta name="keywords" content={keywords || "Music, tracks, artists"}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <Navbar/>
            <Container sx={{padding: 0}} className={styles.content} maxWidth={false}>
                {children}
            </Container>
            {!hide && <Player/>}
        </div>
    );
};

export default MainLayout;

