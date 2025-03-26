import {ObjectId} from "mongoose";

export class CreateAlbumDto {
    readonly title;
    readonly userId: ObjectId;
}