import { createService } from 'react-query-service';
import { decode } from 'jsonwebtoken';
import http from '../http';
import { AuthenticatedUser } from '../users';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: AuthenticatedUser;
}

function validateToken(token: string) {
	try {
		return decode(token, { complete: true }) as Record<any, any>;

		// if (decodedToken.exp > new Date().getTime()) {
		// 	return true;
		// }

		// return false;
	} catch {
		return false;
	}
}

function login(data: LoginRequest) {
	return http.post<LoginResponse>('/authentication/login', data).then(result => {
		if (result.token) {
			http.setToken(result.token);
		}

		return result;
	});
}

async function loginWithToken(token: string | null) {
	if (!token) {
		return Promise.reject();
	}

	const validated = validateToken(token);

	if (validated) {
		http.setToken(token);
		return Promise.resolve(validated.payload.user);
	}

	return Promise.reject();
}

async function logout() {
	http.removeToken();
}

export interface ForgotPasswordRequest {
	email: string;
}

function forgotPassword(data: ForgotPasswordRequest) {
	return http.post('/authentication/forgot-password', data);
}

interface ResetPasswordRequest {
	password: string;
	token: string;
}

function resetPassword(data: ResetPasswordRequest) {
	return http.post('/authentication/reset-password', data);
}

const authenticationService = createService({
	name: 'authentication',
	mutations: {
		login,
		loginWithToken,
		logout,
		forgotPassword,
		resetPassword
	}
});

export default authenticationService;
