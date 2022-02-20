import { useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { http } from '@services';
import { AuthenticatedUser } from '@apps/users';
import authenticationService from '../service';
import { AuthContext } from '../context';
import queryClient from '@config/query-client';

interface JWTPayload {
	exp: number;
	iat: number;
	user: AuthenticatedUser;
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('AuthContext should be used within AuthProvider');
	}

	const { state, actions } = context;

	async function login(token: string) {
		try {
			const { user } = jwtDecode<JWTPayload>(token);
			http.token = token;
			localStorage.setItem('token', token);
			actions.login(user);
		} catch {
			logout();
		}
	}

	function updateAuthState() {
		try {
			const token = localStorage.getItem('token');

			if (token) {
				const { user } = jwtDecode<JWTPayload>(token);

				if (user) {
					http.token = token;
					actions.login(user);
				} else {
					throw new Error();
				}
			} else {
				throw new Error();
			}
		} catch {
			logout();
		}
	}

	async function refreshToken() {
		try {
			const token = await authenticationService.refreshAccessToken();
			localStorage.setItem('token', token);
			return token;
		} catch {
			localStorage.removeItem('token');
		}
	}

	function logout() {
		localStorage.removeItem('token');
		queryClient.getQueryCache().clear();
		http.token = null;
		actions.logout();
	}

	return { authState: state, login, updateAuthState, refreshToken, logout };
};
