import authenticationService from '@app/services/authentication';
import { useContext } from 'react';
import {
    authLoadingAction,
    loginAction,
    logoutAction,
} from '../contexts/auth/actions';
import { AuthContext } from '../contexts/auth/auth.context';

const useAuth = () => {
    const [authState, authDispatch] = useContext(AuthContext);

    function updateAuthState() {
        const token = localStorage.getItem('token');

        authDispatch(authLoadingAction(true));

        return authenticationService
            .loginWithToken(token)
            .then((result) => {
                authDispatch(loginAction(result));
            })
            .catch(() => {
                logout();
            });
    }

    function logout() {
        localStorage.removeItem('token');
        authenticationService.logout();
        authDispatch(logoutAction());
    }

    return { authState, authDispatch, updateAuthState, logout };
};

export default useAuth;
