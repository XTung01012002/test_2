import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './gamecaro.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  /** 🏠 Người chơi tham gia phòng */
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, username } = data;
    const room = await this.gameService.getRoomById(roomId);
    if (!room) {
      client.emit('error', 'Phòng không tồn tại!');
      return;
    }

    if (!room.playerX) {
      room.playerX = username;
    } else if (!room.playerO && room.playerX !== username) {
      room.playerO = username;
    }

    if (room.playerX && room.playerO) {
      room.status = 'ready';
    }

    await room.save();
    client.join(roomId);

    console.log(`📢 Người chơi ${username} đã tham gia phòng ${roomId}`);

    const updatedRoomData = {
      roomId: room._id,
      playerX: room.playerX,
      playerO: room.playerO,
      status: room.status,
      board : room.board,
    };

    this.server.to(roomId).emit('updatePlayers', updatedRoomData);
    this.server.to(roomId).emit('updateRoomStatus', { roomId, status: room.status });
  }

  /** 🚀 Chủ phòng ấn "Bắt đầu" */
  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const room = await this.gameService.getRoomById(roomId);
    
    if (!room || room.status !== 'ready') {
      client.emit('error', 'Không thể bắt đầu trò chơi!');
      return;
    }

    room.status = 'playing';
    await room.save();

    console.log(`🎮 Trò chơi tại phòng ${roomId} đã bắt đầu!`);
    this.server.to(roomId).emit('updateRoomStatus', { roomId, status: 'playing',board: room.board,  });
  }

  /** 🔥 Xử lý nước đi */
  @SubscribeMessage('move')
  async handleMove(
    @MessageBody() data: { roomId: string; player: string; x: number; y: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log(`📌 Player ${data.player} đánh tại (${data.x}, ${data.y}) phòng ${data.roomId}`);
  
      const game = await this.gameService.makeMove(data.roomId, data.player, data.x, data.y);
      
  
      // 🔹 Đảm bảo cập nhật toàn bộ phòng
      this.server.to(data.roomId).emit('gameUpdate', {
        board: game.board, // Cập nhật bàn cờ
        nextTurn: game.currentTurn, // Chuyển lượt chơi
      });
  
      if (game.status === 'finished') {
        this.server.to(data.roomId).emit('gameOver', { winner: game.winner });
        console.log(`🏆 Trò chơi kết thúc! Người thắng: ${game.winner}`);
      }
    
    } catch (error) {
      console.error('❌ Lỗi khi thực hiện nước đi:', error.message);
      client.emit('moveError', { message: error.message });
    }
  }
  
}
