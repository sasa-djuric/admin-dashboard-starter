// Libs
import { rest } from 'msw';

// Config
import { appConfig } from '@config/app';

// Constants
import { RESPONSE_DELAY } from '@services/mocks/constants';
import { usersDB } from '@apps/users/service/mocks/users.db.mock';
import { LoginRequest } from '../service';
import { UnauthorizedException } from '@services/mocks/errors';
import { rolesDB } from '@apps/roles/service/mocks/roles.db.mock';

const login = rest.post<LoginRequest>(
	`${appConfig.apiBaseURL}/authentication/login`,
	(req, res, ctx) => {
		const found = usersDB.find(user => user.email === req.body.email);

		if (!found) {
			return res(ctx.delay(RESPONSE_DELAY), ctx.json(UnauthorizedException()));
		}

		const role = rolesDB.find(role => role.id === found.id);

		return res(
			ctx.delay(RESPONSE_DELAY),
			ctx.json({
				token: 'test-token',
				user: {
					...found,
					permissions: role?.permissions
				}
			})
			// ctx.status(401),
			// ctx.json({ message: 'Invalid email or password' })
		);
	}
);

const forgotPasssword = rest.post(
	`${appConfig.apiBaseURL}/authentication/password/forgot`,
	(req, res, ctx) => {
		return res(
			ctx.delay(RESPONSE_DELAY),
			ctx.json({})
			// ctx.status(401),
			// ctx.json({ message: 'Invalid email or password' })
		);
	}
);

const resetPasssword = rest.post(
	`${appConfig.apiBaseURL}/authentication/password/reset`,
	(req, res, ctx) => {
		return res(
			ctx.delay(RESPONSE_DELAY),
			ctx.json({})
			// ctx.status(401),
			// ctx.json({ message: 'Invalid email or password' })
		);
	}
);

export default [login, forgotPasssword, resetPasssword] as const;
