import {PlayerAction, PlayerActionTypes} from "../../types/player";

export const playTrack = (): PlayerAction => {
    return {type: PlayerActionTypes.PLAY}
}
export const pauseTrack = (): PlayerAction => {
    return {type: PlayerActionTypes.PAUSE}
}
export const setDuration = (payload: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_DURATION, payload}
}
export const setVolume = (payload: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_VOLUME, payload}
}
export const setCurrentTime = (payload: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_CURRENT_TIME, payload}
}
export const setActiveTrack = (payload): PlayerAction => {
    return {type: PlayerActionTypes.SET_ACTIVE, payload}
}
export const hidePlayer = (): PlayerAction => {
    return {type: PlayerActionTypes.HIDE}
}
export const showPlayer = (): PlayerAction => {
    return {type: PlayerActionTypes.SHOW}
}