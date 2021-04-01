import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../modules/authentication/token/token.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(@Inject('TokenService') private readonly tokenService: TokenService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization?.replace(/bearer /gi, '');
		const isValid = this.tokenService.validateAccessToken(token);

		if (!isValid) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
