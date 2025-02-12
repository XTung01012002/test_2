import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Post, Put, Body, Req, UseGuards, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { 
      username: string; 
      password: string; 
      email?: string; 
      nickname?: string; 
      age?: number 
    }) {
    return this.authService.register(body.username, body.password, body.email, body.nickname, body.age);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req, @Body() updateData: { email?: string; nickname?: string; age?: number }) {
    return this.authService.updateProfile(req.user.username, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.username);
  }
}


