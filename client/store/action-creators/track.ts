import {ITrack, TrackAction, TrackActionTypes} from "../../types/track";
import {Dispatch} from "react";
import axios from "axios";
import {API_URL} from "../../http";

export const fetchTracks = (offset: number = 0) => {
    return async (dispatch: Dispatch<TrackAction>) => {
        try {
            let response;
            if(offset) {
                response = await axios.get(`${API_URL}/tracks`, {params: {
                        offset: offset
                    }})
            } else {
                response = await axios.get(`${API_URL}/tracks`)
            }
            dispatch({type: TrackActionTypes.FETCH_TRACKS, payload: response.data.tracks})
        } catch (e) {
            dispatch({
                type: TrackActionTypes.FETCH_TRACKS_ERROR,
                payload: 'Error while loading tracks'
            })
        }
    }
}

export const setTracks = (tracks: ITrack[]) => {
    return (dispatch: Dispatch<TrackAction>) => {
        dispatch({
            type: TrackActionTypes.FETCH_TRACKS,
            payload: tracks
        })
    }
}

export const searchTracks = (query: string) => {
    return async (dispatch: Dispatch<TrackAction>) => {
        try {
            const response = await axios.get(`${API_URL}/tracks/search?query=` + query)
            dispatch({type: TrackActionTypes.FETCH_TRACKS, payload: response.data})
        } catch (e) {
            dispatch({
                type: TrackActionTypes.FETCH_TRACKS_ERROR,
                payload: 'Error while loading tracks'
            })
        }
    }
}