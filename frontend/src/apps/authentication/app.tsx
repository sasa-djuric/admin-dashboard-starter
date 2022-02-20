import { Suspense, useEffect, useState } from 'react';
import { useRoutes } from 'react-router';
import { http } from '@services';
import Spinner from '@components/spinner';
import { useAuth } from './hooks';
import { routesConfig } from './routes';
import { useMockUser } from './mocks/use-mock-user';

import './app.scss';

const App: React.FunctionComponent = ({ children }) => {
	const routes = useRoutes(routesConfig);
	const { authState, updateAuthState, refreshToken, logout } = useAuth();
	const [isInited, setIsInited] = useState(false);

	useEffect(() => {
		updateAuthState();
		setIsInited(true);
		http.refreshTokenHandler = refreshToken;
		http.onUnauthorized = logout;
	}, []);

	// useMockUser();

	return (
		<div className='authentication-app'>
			<Suspense fallback={<Spinner size='large' />}>
				{!isInited ? <Spinner size='large' /> : authState.isAuth ? children : routes}
			</Suspense>
		</div>
	);
};

export default App;
