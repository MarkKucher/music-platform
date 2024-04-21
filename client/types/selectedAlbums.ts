import {IAlbum} from "./album";

export interface selectedAlbumsState {
    selectedAlbums: IAlbum[]
}

export enum selectedAlbumsActionTypes {
    PUSH = "PUSH",
    REMOVE = "REMOVE"
}

interface PushAction {
    type: selectedAlbumsActionTypes.PUSH;
    payload: IAlbum[];
}

interface RemoveAction {
    type: selectedAlbumsActionTypes.REMOVE;
    payload: IAlbum[];
}

export type SelectedAlbumsAction = PushAction | RemoveAction;