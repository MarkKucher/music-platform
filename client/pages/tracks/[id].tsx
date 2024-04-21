import React, {useState, useEffect} from 'react';
import {ITrack} from "../../types/track";
import {useRouter} from "next/router";
import axios from "axios";
import {API_URL} from "../../http";
import GlobalLoader from "../../components/globalLoader";
import TrackInfo from "../../components/TrackInfo";

const TrackPage = () => {
    const [track, setTrack] = useState<ITrack | null>(null)
    const router = useRouter();

    useEffect(() => {
        const getTrack = async () => {
            try {
                const response = await axios.get(`${API_URL}/tracks/` + window.location.pathname.split('/')[2])
                setTrack(response.data)
                console.log(response.data.comments)
            } catch (e) {
                console.log(e)
                router.push('/error')
            }
        }
        getTrack()
    }, [])

    return (
        track ? <TrackInfo serverTrack={track}/> : <GlobalLoader/>
    );
};

export default TrackPage;