import {IComment, ITrack} from "../types/track";

export interface UserDto {
    name: string;
    email: string;
    picture: string;
    listenedTracks: ITrack["_id"][];
    likedTracks: ITrack["_id"][];
    likedComments: IComment["_id"][];
    albums: [];
    isActivated: boolean;
    id: string;
}