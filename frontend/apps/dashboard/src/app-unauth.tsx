// Libs
import { Suspense, useEffect, useState } from 'react';
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
			<Suspense fallback={<Spinner size='large' />}>
				{!authState.isLoading && isInited ? (
					<AppRoutes apps={[authenticationApp]} defaultPath='/login' />
				) : (
					<Spinner size='large' />
				)}
			</Suspense>
		</div>
	);
}

export default UnauthenticatedApp;
