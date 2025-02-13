import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameBoard, GameBoardDocument } from './game-board.model';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameBoard.name) private gameModel: Model<GameBoardDocument>,
  ) {}

  // Khởi tạo game mới và sinh bóngbóng
  async initGame(): Promise<GameBoardDocument> {
    const game = await this.gameModel.create({});
    await game.save();
    console.log(game._id?.toString() || '');
    return this.spawnBalls(game._id?.toString() || '');
  }

  // Sinh bóng ngẫu nhiên
  async spawnBalls(gameId: string): Promise<GameBoardDocument> {
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new NotFoundException('Game không tồn tại');

    const availableCells: number[][] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (game.board[i][j] === 0) availableCells.push([i, j]);
      }
    }

    if (availableCells.length === 0) {
      game.isGameOver = true;
      await game.save();
      throw new BadRequestException('Game đã kết thúc');
    }

    for (let i = 0; i < Math.min(3, availableCells.length); i++) {
      const [x, y] = availableCells.splice(
        Math.floor(Math.random() * availableCells.length),
        1,
      )[0];
      game.board[x][y] = Math.floor(Math.random() * 7) + 1; // Random màu 1-7
    }

    await game.save();
    return game;
  }

  // Di chuyển bóng từ (x1, y1) đến (x2, y2)
  async moveBall(
    gameId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): Promise<GameBoardDocument> {
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new NotFoundException('Game không tồn tại');

    if (![x1, y1, x2, y2].every((v) => v >= 0 && v < 9)) {
      throw new BadRequestException('Nước đi không hợp lệ');
    }

    if (game.board[y1][x1] === 0 || game.board[y2][x2] !== 0) {
      throw new BadRequestException('Nước đi không hợp lệ');
    }

    const path = this.canMove(game.board, x1, y1, x2, y2);
    if (!path) {
      throw new BadRequestException('Không thể di chuyển đến ô đích');
    }

    game.board[y2][x2] = game.board[y1][x1]; // Di chuyển theo trục đúng
    game.board[y1][x1] = 0;

    // Kiểm tra và xóa nếu có 5 bóng cùng màu liên tiếp
    this.checkAndRemoveLines(game);

    await game.save();
    return game;
  }

  async getBallPositions(
    gameId: string,
  ): Promise<{ board: number[][]; isGameOver: boolean }> {
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new NotFoundException('Game không tồn tại');
    const noEmptyCells = game.board.every((row) =>
      row.every((cell) => cell !== 0),
    );

    if (noEmptyCells) {
      game.isGameOver = true;
      await game.save();
    }
    return {
      board: game.board,
      isGameOver: game.isGameOver,
    };
  }

  // Thuật toán BFS tìm đường đi ngắn nhất
  private findShortestPath(
    board: number[][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number[][] | null {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]; // Phải, xuống, trái, lên
    const queue: [number, number][] = [[y1, x1]];
    const visited = new Set();
    const parentMap = new Map();

    visited.add(`${y1},${x1}`);
    while (queue.length > 0) {
      const [cy, cx] = queue.shift()!;

      if (cy === y2 && cx === x2) {
        let path: number[][] = [];
        let cur = `${y2},${x2}`;
        while (cur) {
          const [py, px] = cur.split(',').map(Number);
          path.push([py, px]);
          cur = parentMap.get(cur);
        }
        return path.reverse();
      }

      for (const [dy, dx] of directions) {
        const ny = cy + dy,
          nx = cx + dx;

        if (ny >= 0 && ny < 9 && nx >= 0 && nx < 9) {
          // Kiểm tra giới hạn board
          if (board[ny][nx] === 0 && !visited.has(`${ny},${nx}`)) {
            // Chỉ đi qua ô trống
            queue.push([ny, nx]);
            visited.add(`${ny},${nx}`);
            parentMap.set(`${ny},${nx}`, `${cy},${cx}`);
          }
        }
      }
    }

    return null;
  }

  // Kiểm tra và xóa các dòng có ít nhất 5 bóng cùng màu
  private checkAndRemoveLines(game: GameBoardDocument): void {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    const toRemove = new Set<string>();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (game.board[i][j] === 0) continue;

        for (const [dx, dy] of directions) {
          let line: number[][] = [];
          let x = i,
            y = j;

          while (
            x >= 0 &&
            x < 9 &&
            y >= 0 &&
            y < 9 &&
            game.board[x][y] === game.board[i][j]
          ) {
            line.push([x, y]);
            x += dx;
            y += dy;
          }

          if (line.length >= 5) {
            for (const [lx, ly] of line) toRemove.add(`${lx},${ly}`);
          }
        }
      }
    }

    for (const pos of toRemove) {
      const [x, y] = pos.split(',').map(Number);
      game.board[x][y] = 0;
    }
  }

  // Hàm hỗ trợ di chuyển bóng
  async assistMove(gameId: string): Promise<GameBoardDocument> {
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new NotFoundException('Game không tồn tại');

    // Tìm nước đi tốt nhất
    const bestMove = this.getBestMove(game);
    if (!bestMove) throw new Error('Không có nước đi hợp lệ');

    // Thực hiện di chuyển bóng
    return this.moveBall(
      gameId,
      bestMove.x1,
      bestMove.y1,
      bestMove.x2,
      bestMove.y2,
    );
  }

  // Tìm nước đi tốt nhất theo thứ tự ưu tiên
  private getBestMove(
    game: GameBoard,
  ): { x1: number; y1: number; x2: number; y2: number } | null {
    const board = game.board;

    // 1️⃣ Ưu tiên tìm nước đi giúp NỔ DÃY ngay lập tức
    for (let y1 = 0; y1 < 9; y1++) {
      for (let x1 = 0; x1 < 9; x1++) {
        if (board[y1][x1] !== 0) {
          for (let y2 = 0; y2 < 9; y2++) {
            for (let x2 = 0; x2 < 9; x2++) {
              if (board[y2][x2] === 0 && this.canMove(board, x1, y1, x2, y2)) {
                // Thử di chuyển và kiểm tra nếu nổ dãy
                board[y2][x2] = board[y1][x1];
                board[y1][x1] = 0;
                if (this.hasLine(board, x2, y2)) {
                  return { x1, y1, x2, y2 };
                }
                board[y1][x1] = board[y2][x2];
                board[y2][x2] = 0;
              }
            }
          }
        }
      }
    }

    // 2️⃣ Nếu không nổ ngay, tìm nước đi giúp TẠO CƠ HỘI nổ dãy
    for (let y1 = 0; y1 < 9; y1++) {
      for (let x1 = 0; x1 < 9; x1++) {
        if (board[y1][x1] !== 0) {
          for (let y2 = 0; y2 < 9; y2++) {
            for (let x2 = 0; x2 < 9; x2++) {
              if (board[y2][x2] === 0 && this.canMove(board, x1, y1, x2, y2)) {
                // Thử di chuyển và kiểm tra nếu có thể tạo chuỗi 4 bóng
                board[y2][x2] = board[y1][x1];
                board[y1][x1] = 0;
                if (this.canCreateLine(board, x2, y2)) {
                  return { x1, y1, x2, y2 };
                }
                board[y1][x1] = board[y2][x2];
                board[y2][x2] = 0;
              }
            }
          }
        }
      }
    }

    // 3️⃣ Nếu không có cơ hội nổ, chọn nước đi bất kỳ
    for (let y1 = 0; y1 < 9; y1++) {
      for (let x1 = 0; x1 < 9; x1++) {
        if (board[y1][x1] !== 0) {
          for (let y2 = 0; y2 < 9; y2++) {
            for (let x2 = 0; x2 < 9; x2++) {
              if (board[y2][x2] === 0 && this.canMove(board, x1, y1, x2, y2)) {
                return { x1, y1, x2, y2 };
              }
            }
          }
        }
      }
    }

    return null;
  }

  // Kiểm tra có thể di chuyển từ (x1, y1) đến (x2, y2)
  private canMove(
    board: number[][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): boolean {
    return !!this.findShortestPath(board, x1, y1, x2, y2);
  }

  // Kiểm tra có dãy 5 bóng liên tiếp không
  private hasLine(board: number[][], x: number, y: number): boolean {
    return this.checkLine(board, x, y, 5);
  }

  // Kiểm tra có chuỗi 4 bóng cùng màu không (tạo cơ hội nổ dãy)
  private canCreateLine(board: number[][], x: number, y: number): boolean {
    return this.checkLine(board, x, y, 4);
  }

  // Kiểm tra nếu có ít nhất `length` bóng cùng màu liên tiếp theo các hướng
  private checkLine(
    board: number[][],
    x: number,
    y: number,
    length: number
): boolean {
    if (board[y][x] === 0) return false; 

    const directions = [
        [0, 1],   // Ngang (→)
        [1, 0],   // Dọc (↓)
        [1, 1],   // Chéo phải xuống (↘)
        [1, -1],  // Chéo phải lên (↗)
    ];

    for (const [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < length; step++) {
            const nx = x + dx * step;
            const ny = y + dy * step;

            if (
                ny < 0 || ny >= 9 ||  // Kiểm tra giới hạn Y trước
                nx < 0 || nx >= 9 ||  // Kiểm tra giới hạn X
                board[ny][nx] !== board[y][x] // Kiểm tra màu bóng
            ) {
                break;
            }
            count++;
        }
        if (count >= length) return true;
    }
    return false;
}

}
