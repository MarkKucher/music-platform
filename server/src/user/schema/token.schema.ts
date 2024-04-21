import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
