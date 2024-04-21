import {playNextAction, playNextActionTypes} from "../../types/playNext";

export const shouldPlayNext = (): playNextAction => {
    return {type: playNextActionTypes.SetShouldPlay}
}

export const shouldNotPlayNext = (): playNextAction => {
    return {type: playNextActionTypes.SetShouldNotPlay}
}