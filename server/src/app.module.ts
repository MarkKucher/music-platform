import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { AuthMiddleware } from './user/middlewares/auth-middleware';
import { TokenService } from './user/service/token.service';
import { Token, TokenSchema } from './user/schema/token.schema';
import { AlbumModule } from './album/album.module';
import { MailModule } from './user/service/send-mail-servise/mailer.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, 'static') }),
    MongooseModule.forRoot(
      `mongodb+srv://mark:rootroot@cluster0.5mffzux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    MailModule,
    TrackModule,
    FileModule,
    UserModule,
    AlbumModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/api/users', method: RequestMethod.GET },
      {
        path: '/api/pushLikedTrack/:id/:trackId',
        method: RequestMethod.POST,
      },
      {
        path: '/api/removeLikedTrack/:id/:trackId',
        method: RequestMethod.POST,
      },
    );
  }
}
