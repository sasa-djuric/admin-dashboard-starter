// Libs
import { useContext, useEffect, useState } from 'react';
import { AppRoutes } from './lib/routing';

// Assets
import authenticationApp from './apps/authentication';
import styles from './app-unauth.module.scss';

// Contexts
import { AuthContext } from './contexts/auth/auth.context';
import { authLoading, login } from './contexts/auth/actions';

// Services
import authenticationService from '@startup/services/authentication';

// Components
import Spinner from './components/spinner';

function UnauthenticatedApp() {
	const [authState, authDispatch] = useContext(AuthContext);
	const [isInited, setIsInited] = useState(false);

	function handleAuth() {
		const token = localStorage.getItem('token');

		authDispatch(authLoading(true));

		authenticationService
			.loginWithToken(token)
			.then(result => {
				authDispatch(login(result));
			})
			.catch(() => {
				authDispatch(authLoading(false));
			});
	}

	useEffect(() => {
		handleAuth();
		setIsInited(true);
	}, []);

	return (
		<div className={styles['app-unauth']}>
			{!authState.isLoading && isInited ? (
				<AppRoutes apps={[authenticationApp]} defaultPath='/login' />
			) : (
				<Spinner size='large' />
			)}
		</div>
	);
}

export default UnauthenticatedApp;
