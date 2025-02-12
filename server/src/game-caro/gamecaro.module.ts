import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './gamecaro.controller';
import { GameService } from './gamecaro.service';
import { GameGateway } from './gamecaro.gateway';
import { GameRoom, GameRoomSchema } from './schemas/game-room.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GameRoom.name, schema: GameRoomSchema }]),
    AuthModule,  // 🔥 Đảm bảo AuthModule được import để có JwtService
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameCaroModule {}
