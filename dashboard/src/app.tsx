// Libs
import { Route, Switch } from 'react-router-dom';
import { useContext } from 'react';
import { AppRoutes } from './lib/routing';

// Containers
import AppShell from './containers/app-shell';
import UnauthenticatedApp from './app-unauth';

// Views
import DashboardView from './views/dashboard';

// Assets
import apps from './apps/index';

// Contexts
import { AuthContext } from './contexts/auth/auth.context';

function App() {
	const [authState] = useContext(AuthContext);

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
