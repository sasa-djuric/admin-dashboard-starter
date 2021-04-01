// Libs
import { Route, Switch } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppRoutes } from './lib/routing';

// Containers
import AppShell from './templates/app-shell';
import UnauthenticatedApp from './app-unauth';

// Views
import DashboardView from './views/dashboard';

// Assets
import apps from './apps/index';

// Contexts
import { AuthContext } from './contexts/auth/auth.context';
import { logout } from './contexts/auth/actions';

// Services
import { http } from '@startup/services';
import authenticationService from '@startup/services/authentication';

function App() {
	const [authState, dispatchAuth] = useContext(AuthContext);

	function onUnauthorized() {
		localStorage.removeItem('token');
		authenticationService.logout();
		dispatchAuth(logout());
	}

	function onInit() {
		http.addListener(http.Event.Unauthorized, onUnauthorized);
	}

	useEffect(onInit, []);

	if (!authState.isAuth) return <UnauthenticatedApp />;

	return (
		<div>
			<AppShell>
				<Switch>
					<Route path='/' exact={true} component={DashboardView} />
					<AppRoutes apps={apps} />
				</Switch>
			</AppShell>
		</div>
	);
}

export default App;
