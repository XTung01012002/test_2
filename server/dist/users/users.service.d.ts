import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findOne(username: string): Promise<UserDocument | null>;
    createUser(userData: Partial<User>): Promise<User>;
    findById(userId: string): Promise<UserDocument | null>;
    updateUser(userId: string, updateData: Partial<User>): Promise<UserDocument | null>;
}
