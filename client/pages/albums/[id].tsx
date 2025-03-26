import axios from "axios";
import React, {useState, useEffect} from "react";
import {IAlbum} from "../../types/album";
import {API_URL} from "../../http";
import AlbumInfo from "../../components/AlbumInfo";
import GlobalLoader from "../../components/globalLoader";
import {useRouter} from "next/router";


const AlbumPage = () => {
    const [album, setAlbum] = useState<IAlbum | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getAlbum = async () => {
            try {
                const response = await axios.get(`${API_URL}/albums/one/` + window.location.pathname.split('/')[2])
                setAlbum(response.data)
            } catch (e) {
                console.log(e)
                router.push('/error')
            }
        }
        getAlbum()
    }, [])

    return (
        album ? <AlbumInfo serverAlbum={album}/> : <GlobalLoader/>
    );
};

export default AlbumPage;