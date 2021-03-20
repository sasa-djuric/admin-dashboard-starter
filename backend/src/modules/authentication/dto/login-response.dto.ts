import { AuthUser } from '../interfaces';

export class LoginResponseDto {
	user: AuthUser;
	token: string;
}
