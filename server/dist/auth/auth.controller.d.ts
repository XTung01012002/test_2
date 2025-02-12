import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        password: string;
        email?: string;
    }): Promise<import("../users/schemas/user.schema").User>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        access_token: string;
    }>;
    updateProfile(req: any, updateData: {
        email?: string;
        nickname?: string;
        age?: number;
    }): Promise<{
        message: string;
        user: import("../users/schemas/user.schema").UserDocument;
    }>;
}
