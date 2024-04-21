import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/schema/user.schema";
import {AlbumController} from "./album.controller";
import {AlbumService} from "./album.service";
import {Track, TrackSchema} from "../track/schema/track.schema";
import {Album, AlbumSchema} from "./schema/album.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}])
    ],
    controllers: [AlbumController],
    providers: [AlbumService]
})
export class AlbumModule {}