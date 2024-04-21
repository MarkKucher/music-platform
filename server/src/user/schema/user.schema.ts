import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Track } from '../../track/schema/track.schema';
import { Album } from '../../album/schema/album.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  activationLink: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  likedTracks: Track[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  listenedTracks: Track[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  likedComments: Comment[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }] })
  albums: Album[];
}

export const UserSchema = SchemaFactory.createForClass(User);
