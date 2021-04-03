import authenticationService from '@startup/services/authentication';

export function refreshToken() {
	return authenticationService.refreshAccessToken().then(
		token => {
			localStorage.setItem('token', token);
			return token;
		},
		err => {
			localStorage.removeItem('token');
			throw err;
		}
	);
}
