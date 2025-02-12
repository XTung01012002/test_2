import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async register(username: string, password: string, email?: string, nickname?: string, age?: number) {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
        throw new Error('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        email,
        nickname,
        age,
    };

    const savedUser = await this.usersService.createUser(newUser);
    return savedUser;
}


  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id };
    const secret = this.configService.get<string>('JWT_SECRET') ?? '';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return {
      message: 'Đăng nhập thành công',
      access_token: token,
      username : user.email
    };
  }

  async updateProfile(
    username: string,
    updateData: { email?: string; nickname?: string; age?: number },
  ) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new Error('Tài khoản không tồn tại');
    }

    if (updateData.email) user.email = updateData.email;
    if (updateData.nickname) user.nickname = updateData.nickname;
    if (updateData.age) user.age = updateData.age;

    await user.save();
    return { message: 'Cập nhật thông tin thành công', user };
  }

  async getProfile(username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new Error('Tài khoản không tồn tại');
    }
    return user;
  }
}
