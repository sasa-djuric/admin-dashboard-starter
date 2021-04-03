import { createService } from 'react-query-service';
import { decode } from 'jsonwebtoken';
import { AuthenticatedUser } from '../users';
import { getQueryClient } from '..';
import http from '../http';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: AuthenticatedUser;
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

	const decoded = decode(token, { complete: true }) as Record<any, any>;

	if (decoded) {
		http.setToken(token);
		return Promise.resolve(decoded.payload.user);
	}

	return Promise.reject();
}

async function logout() {
	http.removeToken();
	getQueryClient().getQueryCache().clear();
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
