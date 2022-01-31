import { AuthenticatedUser } from '@apps/users/service';
import http from '@services/http';

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

export default {
	login,
	forgotPassword,
	resetPassword,
	activation,
	refreshAccessToken
} as const;
