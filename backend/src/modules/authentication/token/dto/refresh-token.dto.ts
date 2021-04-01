import { IsNotEmpty } from 'class-validator';

export class RefreshTokenCookiesDto {
	@IsNotEmpty()
	['refresh-token']: string;
}
