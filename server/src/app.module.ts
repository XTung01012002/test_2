import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GameModule } from './game-line98/gameline98.module';
import { GameCaroModule } from './game-caro/gamecaro.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "", //
      {
        connectionFactory: (connection) => {
          console.log('✅ MongoDB connected successfully!', 'Database');
          return connection;
        },
      },
    ),
    GameCaroModule,
    AuthModule,
    UsersModule,
    GameModule,
  ],
})
export class AppModule {}
