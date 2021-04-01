import { createService } from 'react-query-service';
import { decode } from 'jsonwebtoken';
import { AuthenticatedUser } from '../users';
import http from '../http';

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
	return http.post('/authentication/password/forgot', data);
}

export interface ResetPasswordRequest {
	password: string;
	token: string;
}

function resetPassword(data: ResetPasswordRequest) {
	return http.post('/authentication/password/reset', data);
}

export interface ActivationRequest {
	password: string;
	token: string;
}

function activation(data: ActivationRequest) {
	return http.post('/authentication/activation', data);
}

function refreshAccessToken() {
	return http.get<string>('/token/refresh');
}

const authenticationService = createService({
	name: 'authentication',
	mutations: {
		login,
		loginWithToken,
		logout,
		forgotPassword,
		resetPassword,
		activation,
		refreshAccessToken
	}
});

export default authenticationService;
