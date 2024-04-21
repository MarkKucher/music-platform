import $api from "../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";
export default class AuthService {
    static async login (email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/login', {email, password})
    }

    static async registration (name: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/registration', {name, email, password})
    }

    static async logout (): Promise<void> {
        return $api.post('/api/logout')
    }

    static async pushLikedTrack (userId: string, trackId: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post(`/api/pushLikedTrack/${userId}/${trackId}`)
    }

    static async removeLikedTrack (userId: string, trackId: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post(`/api/removeLikedTrack/${userId}/${trackId}`)
    }
}