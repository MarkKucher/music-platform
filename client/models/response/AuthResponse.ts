import {UserDto} from "../UserDto";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}