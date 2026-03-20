import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserPreferencesDto } from "../dto/user-preferences.dto";
import { UserProfileDto } from "../dto/user-profile.dto";
import { UserDto } from "../dto/user.dto";

export interface IUserService {
    createUser(dto: CreateUserDto): Promise<UserDto>;
  
    getUserById(userId: string): Promise<UserDto>;
    getUserByEmail(email: string): Promise<UserDto | null>;
    getUsersByIds(userIds: string[]): Promise<UserDto[]>;
  
    getUserProfile(userId: string): Promise<UserProfileDto>;
  
    updateUser(userId: string, dto: UpdateUserDto): Promise<UserDto>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto>;
  
    activateUser(userId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
    deleteUser(userId: string): Promise<void>;
  
    updateEmail(userId: string, newEmail: string): Promise<void>;
    verifyEmail(userId: string): Promise<void>;
  
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
  
    updatePreferences(userId: string, prefs: UserPreferencesDto): Promise<void>;
    getPreferences(userId: string): Promise<UserPreferencesDto>;
}