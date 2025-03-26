import {combineReducers} from "redux";
import {playerReducer} from "./playerReducer";
import {HYDRATE} from "next-redux-wrapper";
import {trackReducer} from "./trackReducer";
import {userReducer} from "./userReducer";
import {albumReducer} from "./albumReducer";
import {selectedAlbumsReducer} from "./selectedAlbumsReducer";
import {playNextReducer} from "./playNextReducer";


export const rootReducer = combineReducers({
    player: playerReducer,
    track: trackReducer,
    user: userReducer,
    album: albumReducer,
    selectedAlbums: selectedAlbumsReducer,
    playNext: playNextReducer
})

export const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        if (state.count) nextState.count = state.count; // preserve count value on client side navigation
        return nextState;
    } else {
        return rootReducer(state, action);
    }
};

export type RootState = ReturnType<typeof rootReducer>