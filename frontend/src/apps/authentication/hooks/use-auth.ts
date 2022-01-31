import { useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { http } from '@services';
import { AuthenticatedUser } from '@apps/users/service';
import authenticationService from '../service';
import { AuthContext } from '../context';
import queryClient from '@config/query-client';

const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('AuthContext should be used within AuthProvider');
	}

	const { state, actions } = context;

	async function login(accessToken: string) {
		try {
			const user = jwtDecode<AuthenticatedUser>(accessToken);
			http.setToken(accessToken);
			localStorage.setItem('token', accessToken);
			actions.login(user);
		} catch {
			logout();
		}
	}

	function updateAuthState() {
		try {
			actions.setIsAuthenticating(true);

			const token = localStorage.getItem('token');

			if (token) {
				const user = jwtDecode<AuthenticatedUser>(token);

				if (user) {
					actions.login(user);
					http.setToken(token);
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
		http.removeToken();
		actions.logout();
	}

	return { authState: state, login, updateAuthState, refreshToken, logout };
};

export default useAuth;
