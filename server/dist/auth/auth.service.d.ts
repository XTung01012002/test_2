import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private configService;
    constructor(usersService: UsersService, configService: ConfigService);
    register(username: string, password: string, email?: string): Promise<import("../users/schemas/user.schema").User>;
    login(username: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    updateProfile(userId: string, updateData: {
        email?: string;
        nickname?: string;
        age?: number;
    }): Promise<{
        message: string;
        user: import("../users/schemas/user.schema").UserDocument;
    }>;
}
