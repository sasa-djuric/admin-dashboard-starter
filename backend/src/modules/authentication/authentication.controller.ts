import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, LoginResponseDto, ActivationDto } from './dto';

@Controller('authentication')
export class AuthenticationController {
	constructor(private readonly authService: AuthenticationService) {}

	@Post('/login')
	async login(@Body() data: LoginDto, @Res() response: Response): Promise<LoginResponseDto> {
		const { refreshToken, ...result } = await this.authService.login(data);

		response.cookie('refresh-token', refreshToken, {
			sameSite: 'strict',
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
		});

		response.json(result);

		return result;
	}

	@Post('password/forgot')
	forgotPassword(@Body() data: ForgotPasswordDto): Promise<void> {
		return this.authService.forgotPassword(data);
	}

	@Post('password/reset')
	resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
		return this.authService.resetPassword(data);
	}

	@Post('activation')
	activation(@Body() data: ActivationDto): Promise<void> {
		return this.authService.activation(data);
	}
}
