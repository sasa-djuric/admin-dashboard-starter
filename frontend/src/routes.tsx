// Libs
import { Navigate, RouteObject } from 'react-router';

// Views
import DashboardView from './views/dashboard/dashboard';

import apps from './apps';

export const routesConfig: Array<RouteObject> = [
	...apps.roles.routes,
	...apps.users.routes,
	{
		path: '/',
		element: <DashboardView />
	},
	{
		path: '*',
		element: <Navigate to='/' />
	}
];
