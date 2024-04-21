import {UserAction, UserActionTypes, UserState} from "../../types/user";

const initialState: UserState = {
    user: null,
    isAuth: false
}

export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.SET_USER:
            return {...state, user: action.payload};
        case UserActionTypes.SET_AUTH:
            return {...state, isAuth: true};
        case UserActionTypes.SET_NOT_AUTH:
            return {...state, isAuth: false};

        default:
            return state;
    }
}