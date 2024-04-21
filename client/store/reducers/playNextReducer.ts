import {playNextAction, playNextActionTypes, playNextState} from "../../types/playNext";

export const initialState: playNextState = {
    shouldPlayNext: false
}

export const playNextReducer = (state = initialState, action: playNextAction): playNextState => {
    switch (action.type) {
        case playNextActionTypes.SetShouldPlay:
            return {...state, shouldPlayNext: true};
        case playNextActionTypes.SetShouldNotPlay:
            return {...state, shouldPlayNext: false};
        default:
            return state;
    }
}