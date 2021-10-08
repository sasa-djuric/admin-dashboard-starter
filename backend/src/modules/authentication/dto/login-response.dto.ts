import { User } from '../../../modules/users/user.entity';

export class LoginResponseDto {
	user: Omit<User, 'password'>;
	token: string;
}
