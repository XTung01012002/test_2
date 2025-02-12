import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './gameline98.controller';
import { GameBoard, GameBoardSchema } from './game-board.model';
import { GameService } from './gameline98.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: GameBoard.name, schema: GameBoardSchema }])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
