import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from '../../track/schema/track.schema';
import { User } from '../../user/schema/user.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  favorite: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
