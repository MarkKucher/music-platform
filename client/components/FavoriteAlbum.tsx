import React from 'react';
import {IAlbum} from "../types/album";
import AlbumItem from "./AlbumItem";
import {Box, Grid} from "@mui/material";

interface FavoriteAlbumProps {
    album: IAlbum;
}

const FavoriteAlbum: React.FC<FavoriteAlbumProps> = ({album}) => {
    return (
        <Grid key={"favorite"} container direction="column">
            <Box p={3}>
                <AlbumItem album={album} favorite={true}/>
            </Box>
        </Grid>
    );
};

export default FavoriteAlbum;