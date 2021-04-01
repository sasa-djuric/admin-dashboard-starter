import { Controller, Get } from '@nestjs/common';
import { Cookie } from '../../../core/decorators';
import { RefreshTokenCookiesDto } from './dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@Get('/refresh')
	refreshAccessToken(@Cookie() cookies: RefreshTokenCookiesDto): Promise<string> {
		const refreshToken = cookies['refresh-token'];
		return this.tokenService.refreshAccessToken(refreshToken);
	}
}
