import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { GameService } from './gameline98.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame() {
    return this.gameService.initGame();
  }

  // API sinh bóng ngẫu nhiên
  @Put('spawn/:gameId')
  async spawnBalls(@Param('gameId') gameId: string) {
    return this.gameService.spawnBalls(gameId);
  }

  // api di chuyển bóng từ (x1, y1) đến (x2, y2)
  @Put('move/:gameId')
  async moveBall(@Param('gameId') gameId: string, @Body() body: { x1: number, y1: number, x2: number, y2: number }) {
    return this.gameService.moveBall(gameId, body.x1, body.y1, body.x2, body.y2);
  }

  // API để lấy vị trí các bóng hiện tại
  @Post(':gameId/assist')
  async assistMove(@Param('gameId') gameId: string) {
    return this.gameService.assistMove(gameId);
  }

  // API để lấy vị trí các bóng hiện tại
  @Get(':gameId/position')
  async getBallPositions(@Param('gameId') gameId: string) {
    return this.gameService.getBallPositions(gameId);
  }
}

