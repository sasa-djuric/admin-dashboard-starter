// Libs
import { rest } from 'msw';

// Config
import api from '../../config/api';

// Constants
import { RESPONSE_DELAY } from '../../mocks/constants';

const login = rest.post(`${api.baseURL}/authentication/login`, (req, res, ctx) => {
	return res(
		ctx.delay(RESPONSE_DELAY),
		ctx.json({
			email: 'dev@mail.com',
			token: 'test-token'
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
