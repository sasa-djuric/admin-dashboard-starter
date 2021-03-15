import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Controller('authentication')
export class AuthenticationController {
	constructor(private readonly authService: AuthenticationService) {}

	@Post('/login')
	login(@Body() data: LoginDto) {
		return this.authService.login(data);
	}

	@Post('forgot-password')
	forgotPassword(@Body() data: ForgotPasswordDto) {
		return this.authService.forgotPassword(data);
	}

	@Post('reset-password')
	resetPassword(@Body() data: ResetPasswordDto) {
		return this.authService.resetPassword(data);
	}
}
