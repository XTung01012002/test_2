"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    async register(username, password, email) {
        const existingUser = await this.usersService.findOne(username);
        if (existingUser) {
            throw new Error('Username already taken');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword, email };
        const savedUser = await this.usersService.createUser(newUser);
        return savedUser;
    }
    async login(username, password) {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new common_1.UnauthorizedException('Tài khoản không tồn tại');
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user._id };
        const secret = this.configService.get('JWT_SECRET') ?? '';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        return {
            message: 'Đăng nhập thành công',
            access_token: token,
        };
    }
    async updateProfile(userId, updateData) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }
        if (updateData.email)
            user.email = updateData.email;
        if (updateData.nickname)
            user.nickname = updateData.nickname;
        if (updateData.age)
            user.age = updateData.age;
        await user.save();
        return { message: 'Cập nhật thông tin thành công', user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map