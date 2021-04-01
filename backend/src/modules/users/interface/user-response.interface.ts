import { User } from '../user.entity';

export interface UserResponse extends User {
	profileImage: string;
}
