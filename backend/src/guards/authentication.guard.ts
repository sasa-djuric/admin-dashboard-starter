import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor() {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization?.replace(/bearer /gi, '');

		return this.validate(token);
	}

	validate(token: any) {
		const jwtSecret = process.env.JWT_SECRET;

		try {
			return !!verify(token, jwtSecret);
		} catch {
			throw new UnauthorizedException();
		}
	}
}
