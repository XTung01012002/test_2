import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameRoomDocument = GameRoom & Document;

@Schema()
export class GameRoom {
  @Prop({  unique: true })
  roomId: string;

  @Prop({ type: String })
  playerX: string | null;

  @Prop({ type: String, default: null })
  playerO: string | null;

  @Prop({  enum: ['waiting', 'ready','playing', 'finished'],default: 'waiting' }) // 'waiting' | 'playing' | 'finished'
  status: string;

  @Prop({ type: [[String]], default: () => Array(15).fill(Array(15).fill('')) }) // 15x15 bảng cờ
  board: string[][];

  @Prop({ default: 'X' }) // 'X' hoặc 'O'
  currentTurn: string;

  @Prop()
  winner?: string; // Username của người thắng cuộc

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);
