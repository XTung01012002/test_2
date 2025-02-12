import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    // { provide: APP_GUARD, useClass: JwtAuthGuard }, // 🔥 Dùng APP_GUARD để áp dụng toàn hệ thống
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // 🔥 Xuất JwtModule để GameCaroModule có thể dùng
})
export class AuthModule {}
