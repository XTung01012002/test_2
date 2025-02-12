import { Controller, Post, Param, Body, Get, UseGuards ,Req} from '@nestjs/common';
import { GameService } from './gamecaro.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('gamecaro')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-room')
  async createRoom(@Req() req: any) {
    return this.gameService.createRoom(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinRoom(@Req() req: any) {
    const playerO = req.user.username;  // 🔥 Lấy username từ token
    return this.gameService.joinRoom(playerO);
  } 

  @Post('move/:roomId')
  makeMove(
    @Param('roomId') roomId: string,
    @Body('player') player: string,
    @Body('x') x: number,
    @Body('y') y: number,
  ) {
    return this.gameService.makeMove(roomId, player, x, y);
  }

  @Post('leave/:roomId')
  leaveRoom(@Param('roomId') roomId: string, @Body('player') player: string) {
    return this.gameService.leaveRoom(roomId, player);
  }

    // @Get('status/:roomId')
    // getGameStatus(@Param('roomId') roomId: string) {
    //   return this.gameService.getGameStatus(roomId);
    // }
}

