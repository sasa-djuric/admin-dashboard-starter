import { Injectable, NestMiddleware } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { RedisService } from 'nestjs-redis';
import { Role } from 'src/modules/roles/role.entity';
import { RolesService } from 'src/modules/roles/roles.service';
import { AuthToken } from '../../modules/authentication/interfaces/auth-token.interface';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(
		private readonly redisService: RedisService,
		private readonly rolesService: RolesService
	) {}

	async use(req: any, res: any, next: () => void) {
		try {
			const token = req.headers.authorization?.replace(/bearer /gi, '');

			if (!token) {
				return next();
			}

			const { user } = decode(token) as AuthToken;

			if (!user) {
				next();
			}

			let role = await this.redisService
				.getClient()
				.get(`role:${user.roleId}`)
				.then(role => (role ? (JSON.parse(role) as Role) : null));

			if (!role) {
				role = await this.rolesService.getById(user.roleId);
				this.redisService
					.getClient()
					.setex(`role:${user.roleId}`, 24 * 60 * 60, JSON.stringify(role));
			}

			req.user = { ...user, permissions: role.permissions };

			next();
		} catch {
			next();
		}
	}
}
