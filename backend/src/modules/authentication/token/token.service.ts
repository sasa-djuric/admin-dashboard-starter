import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { ID } from '../../../core/types';
import { v4 as uuid } from 'uuid';
import { AuthUser } from '../interfaces';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TokenService {
	private readonly ACCESS_TOKEN_EXPIRE_TIME_SEC = 15 * 60;
	private readonly REFRESH_TOKEN_EXPIRE_TIME_SEC = 6 * 30 * 24 * 60 * 60;
	private readonly EXPIRED_ERROR_CODE = 'TOKEN_EXPIRED';

	constructor(
		private readonly usersService: UsersService,
		private readonly redisService: RedisService
	) {}

	public generateAccessToken(user: AuthUser): string {
		return sign({ user }, process.env.JWT_SECRET, {
			expiresIn: this.ACCESS_TOKEN_EXPIRE_TIME_SEC
		});
	}

	public async refreshAccessToken(refreshToken: string): Promise<string> {
		const userId = await this.redisService.getClient().get(refreshToken);

		if (!userId) {
			throw new UnauthorizedException();
		}

		const user: AuthUser = await this.usersService.getByIdWithPermissions(parseInt(userId));

		if (!user.isActive) {
			this.redisService.getClient().del(refreshToken);
			throw new UnauthorizedException();
		}

		return this.generateAccessToken(user);
	}

	public setRefreshToken(userId: ID): string {
		const token = uuid();
		this.redisService.getClient().setex(token, this.REFRESH_TOKEN_EXPIRE_TIME_SEC, userId);
		return token;
	}

	public validateAccessToken(token: string): boolean {
		try {
			return !!verify(token, process.env.JWT_SECRET);
		} catch (err) {
			if (err instanceof TokenExpiredError) {
				throw new UnauthorizedException({
					message: 'Access token expired',
					code: this.EXPIRED_ERROR_CODE
				});
			}

			throw new UnauthorizedException();
		}
	}
}
