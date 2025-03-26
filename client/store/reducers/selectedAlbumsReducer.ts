import {SelectedAlbumsAction, selectedAlbumsActionTypes, selectedAlbumsState} from "../../types/selectedAlbums";


export const initialState: selectedAlbumsState = {
    selectedAlbums: []
}

export const selectedAlbumsReducer = (state = initialState, action: SelectedAlbumsAction): selectedAlbumsState => {
    switch (action.type) {
        case selectedAlbumsActionTypes.PUSH:
            return {...state, selectedAlbums: action.payload}
        case selectedAlbumsActionTypes.REMOVE:
            return {...state, selectedAlbums: action.payload}
        default:
            return state;
    }
}