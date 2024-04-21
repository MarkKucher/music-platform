import {IAlbum} from "../../types/album";
import {SelectedAlbumsAction, selectedAlbumsActionTypes} from "../../types/selectedAlbums";

export const PushSelectedAlbum = (payload: IAlbum[]): SelectedAlbumsAction => {
    return {type: selectedAlbumsActionTypes.PUSH, payload};
}

export const RemoveSelectedAlbum = (payload: IAlbum[]): SelectedAlbumsAction => {
    return {type: selectedAlbumsActionTypes.REMOVE, payload};
}