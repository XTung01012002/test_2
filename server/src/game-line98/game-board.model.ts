import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameBoardDocument = GameBoard & Document;

@Schema()
export class GameBoard {
  @Prop({ type: [[Number]], default: () => Array(9).fill(0).map(() => Array(9).fill(0)) })
  board: number[][];

  @Prop({ type: Boolean, default: false })
  isGameOver: boolean;
}

export const GameBoardSchema = SchemaFactory.createForClass(GameBoard);
