import React from 'react';
import {IAlbum} from "../types/album";
import {Box, Grid} from "@mui/material";
import AlbumItem from "./AlbumItem";
import FavoriteAlbum from "./FavoriteAlbum";

interface AlbumListProps {
    albums: IAlbum[];
    setAlbums: any;
    offer: boolean;
    close: boolean;
}

const AlbumList: React.FC<AlbumListProps> = ({albums, setAlbums, offer, close}) => {
    return (
        <Grid container direction="column">
            <Box p={2}>
                {albums.length == 0 ? <h1>No available albums</h1>
                    : albums.map(album =>
                        album.favorite ?
                            <FavoriteAlbum album={album}></FavoriteAlbum>
                            : <AlbumItem
                            close={close}
                            key={album._id}
                            album={album}
                            albums={albums}
                            setAlbums={setAlbums}
                            offer={offer}
                            favorite={false}
                        />
                    )
                }
            </Box>
        </Grid>
    );
};

export default AlbumList;