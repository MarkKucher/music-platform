import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Token, TokenSchema } from './schema/token.schema';
import { TokenService } from './service/token.service';
import { SendMailService } from './service/send-mail-servise/send-mail.service';
import { TrackModule } from '../track/track.module';
import { FileService } from '../file/file.service';
import { Track, TrackSchema } from '../track/schema/track.schema';
import { Album, AlbumSchema } from '../album/schema/album.schema';
import { MailModule } from './service/send-mail-servise/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    TrackModule,
    MailModule,
  ],
  providers: [UserService, TokenService, SendMailService, FileService],
  controllers: [UserController],
})
export class UserModule {}
