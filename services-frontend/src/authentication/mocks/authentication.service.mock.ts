// Libs
import { rest } from 'msw';

// Config
import api from '../../config/api';

// Constants
import { RESPONSE_DELAY } from '../../mocks/constants';
import { usersDB } from '../../users/mocks/users.db.mock';
import { LoginRequest } from '../authentication.service';
import { UnauthorizedException } from '../../mocks/errors';
import { rolesDB } from '../../roles/mocks/roles.db.mock';

const login = rest.post<LoginRequest>(`${api.baseURL}/authentication/login`, (req, res, ctx) => {
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
});

const forgotPasssword = rest.post(`${api.baseURL}/authentication/forgot-password`, (req, res, ctx) => {
	return res(
		ctx.delay(RESPONSE_DELAY),
		ctx.json({})
		// ctx.status(401),
		// ctx.json({ message: 'Invalid email or password' })
	);
});

const resetPasssword = rest.post(`${api.baseURL}/authentication/reset-password`, (req, res, ctx) => {
	return res(
		ctx.delay(RESPONSE_DELAY),
		ctx.json({})
		// ctx.status(401),
		// ctx.json({ message: 'Invalid email or password' })
	);
});

export default [login, forgotPasssword, resetPasssword];
