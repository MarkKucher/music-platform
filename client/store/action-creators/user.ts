import {UserAction, UserActionTypes} from "../../types/user";
import {UserDto} from "../../models/UserDto";

export const setUser = (payload: UserDto): UserAction => {
    return {type: UserActionTypes.SET_USER, payload};
}

export const setAuth = (): UserAction => {
    return {type: UserActionTypes.SET_AUTH};
}

export const setNotAuth = (): UserAction => {
    return {type: UserActionTypes.SET_NOT_AUTH};
}
