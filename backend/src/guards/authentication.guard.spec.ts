import { AuthenticationGuard } from './authentication.guard';
import { sign } from 'jsonwebtoken';
import { setupContextRequest } from '../utils/test';

describe('AuthenticationGuard', () => {
	beforeAll(() => {
		process.env.JWT_SECRET = 'secret';
	});

	it('should be defined', () => {
		expect(new AuthenticationGuard()).toBeDefined();
	});

	it('should prevent access (unauthorized)', () => {
		expect(() =>
			new AuthenticationGuard().canActivate(
				setupContextRequest({
					headers: { authorization: 'Bearer test' }
				})
			)
		).toThrowError();
	});

	it('should allow access (unauthorized)', () => {
		const token = sign({ test: 'test' }, process.env.JWT_SECRET);

		expect(
			new AuthenticationGuard().canActivate(
				setupContextRequest({
					headers: { authorization: `Bearer ${token}` }
				})
			)
		).toBeTruthy();
	});
});
