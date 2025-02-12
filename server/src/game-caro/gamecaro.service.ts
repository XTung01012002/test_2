import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameRoom, GameRoomDocument } from './schemas/game-room.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoomDocument>,
  ) {}

  // 1️⃣ Tạo phòng chơi mới
  async createRoom(req: any): Promise<GameRoom> {
    const playerX = req.user.username; // Lấy username từ JWT
    if (!playerX) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    const room = new this.gameRoomModel({
      roomId: `${Date.now()}`,
      playerX,
      status: 'waiting',
      board: Array.from({ length: 15 }, () => Array(15).fill('')), // Khắc phục lỗi mảng tham chiếu
    });

    return room.save();
  }

  // 2️⃣ Tìm phòng đang chờ và tham gia
  async joinRoom(playerO: string): Promise<GameRoom> {
    const room = await this.gameRoomModel
      .findOne({ status: 'waiting' })
      .sort({ createdAt: 1 });

    if (!room) throw new NotFoundException('Không có phòng trống');
    if (room.playerX === playerO)
      throw new BadRequestException(
        'Bạn không thể tham gia phòng do chính bạn tạo',
      );

    room.playerO = playerO;
    room.status = 'ready';
    return room.save();
  }

  // 3️⃣ Đánh dấu khi người chơi thực hiện nước đi
  async makeMove(
    roomId: string,
    player: string,
    x: number,
    y: number,
  ): Promise<GameRoom> {
    const room = await this.gameRoomModel.findById(roomId);
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    console.log(
      `📌 Kiểm tra trước khi đi: x=${x}, y=${y}, giá trị tại [y][x]:`,
      room.board[y][x],
    );

    // Kiểm tra nếu ô đã có quân
    if (room.board[y][x] !== '') {
      throw new BadRequestException('Ô này đã có quân cờ!');
    }
    // console.log('1', JSON.stringify(room.currentTurn));
    // console.log('2', JSON.stringify(player));

    if (room.currentTurn !== player) {
      throw new BadRequestException('Không phải lượt của bạn!');
    }

    // Tạo bản sao bàn cờ để tránh thay đổi trực tiếp
    const updatedBoard = room.board.map((row) => [...row]);
    updatedBoard[y][x] = room.currentTurn;

    // Cập nhật trạng thái phòng
    room.board = updatedBoard;
    room.currentTurn = room.currentTurn === 'X' ? 'O' : 'X';

    // Kiểm tra người thắng
    if (this.checkWinner(updatedBoard, x, y)) {
      room.winner = player;
      room.status = 'finished';
    }

    return room.save();
  }

  // 4️⃣ Kiểm tra người thắng cuộc
  private checkWinner(board: string[][], x: number, y: number): boolean {
    const directions = [
      [1, 0],
      [-1, 0], // Dọc
      [0, 1],
      [0, -1], // Ngang
      [1, 1],
      [-1, -1], // Chéo chính
      [1, -1],
      [-1, 1], // Chéo phụ
    ];

    const player = board[y][x];
    if (!player) return false;

    for (const [dx, dy] of directions) {
      let count = 1;
      let i = 1;

      while (this.isValidCell(x + i * dx, y + i * dy, board, player)) {
        count++;
        i++;
      }

      i = 1;
      while (this.isValidCell(x - i * dx, y - i * dy, board, player)) {
        count++;
        i++;
      }

      if (count >= 5) return true; // Đủ 5 quân liên tiếp
    }

    return false;
  }

  // Kiểm tra ô hợp lệ
  private isValidCell(
    x: number,
    y: number,
    board: string[][],
    player: string,
  ): boolean {
    return x >= 0 && y >= 0 && x < 15 && y < 15 && board[y][x] === player;
  }

  // 5️⃣ Thoát khỏi phòng chơi
  async leaveRoom(roomId: string, player: string): Promise<GameRoom> {
    const room = await this.gameRoomModel.findOne({ roomId });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    // Kiểm tra xem người chơi có trong phòng không
    if (room.playerX !== player && room.playerO !== player) {
      throw new ForbiddenException('Bạn không ở trong phòng này');
    }

    // Xóa người chơi khỏi phòng
    if (room.playerX === player) room.playerX = null;
    if (room.playerO === player) room.playerO = null;

    // Nếu phòng trống thì xóa luôn
    if (!room.playerX && !room.playerO) {
      await this.gameRoomModel.deleteOne({ roomId });
      return room;
    }

    return room.save();
  }

  async getRoomById(roomId: string): Promise<GameRoomDocument | null> {
    return this.gameRoomModel.findById(roomId).exec();
  }
}
