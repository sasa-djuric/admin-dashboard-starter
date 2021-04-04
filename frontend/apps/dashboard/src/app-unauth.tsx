// Libs
import { useEffect, useState } from 'react';
import { AppRoutes } from './lib/routing';

// Assets
import authenticationApp from './apps/authentication';
import styles from './app-unauth.module.scss';

// Components
import Spinner from './components/spinner';

// Hooks
import useAuth from './hooks/use-auth';

function UnauthenticatedApp() {
	const { authState, updateAuthState } = useAuth();
	const [isInited, setIsInited] = useState(false);

	useEffect(() => {
		updateAuthState();
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
