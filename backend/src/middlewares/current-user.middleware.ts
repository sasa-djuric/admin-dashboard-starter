import { Injectable, NestMiddleware } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { omit } from 'ramda';
import { AuthToken } from 'src/modules/authentication/interfaces/auth-token.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(private readonly userService: UsersService) {}

	async use(req: any, res: any, next: () => void) {
		const token = req.headers.authorization?.replace(/bearer /gi, '');

		if (!token) {
			return next();
		}

		const payload = decode(token) as AuthToken;
		const user = await this.userService.getById(payload.user.id);

		req.user = omit(['password'], user);

		next();
	}
}
