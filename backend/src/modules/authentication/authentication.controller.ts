import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, LoginResponseDto } from './dto';

@Controller('authentication')
export class AuthenticationController {
	constructor(private readonly authService: AuthenticationService) {}

	@Post('/login')
	login(@Body() data: LoginDto): Promise<LoginResponseDto> {
		return this.authService.login(data);
	}

	@Post('forgot-password')
	forgotPassword(@Body() data: ForgotPasswordDto): Promise<void> {
		return this.authService.forgotPassword(data);
	}

	@Post('reset-password')
	resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
		return this.authService.resetPassword(data);
	}
}
