import {UserDto} from "../models/UserDto";

export interface UserState {
    user: UserDto | null;
    isAuth: boolean;
}

export enum UserActionTypes {
    SET_AUTH = 'SET_AUTH',
    SET_NOT_AUTH = 'SET_NOT_AUTH',
    SET_USER = 'SET_USER'
}

interface SetAuthAction {
    type: UserActionTypes.SET_AUTH
}

interface SetNotAuthAction {
    type: UserActionTypes.SET_NOT_AUTH
}

interface SetUserAction {
    type: UserActionTypes.SET_USER,
    payload: UserDto
}


export type UserAction = SetAuthAction | SetNotAuthAction | SetUserAction;