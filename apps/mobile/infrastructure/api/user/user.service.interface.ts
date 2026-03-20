export interface IUserService {
  getProfile(): Promise<UserResponse>;
  updateProfile(data: UpdateUserRequest): Promise<UserResponse>;
}