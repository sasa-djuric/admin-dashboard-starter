// Libs
import { Navigate, RouteObject } from 'react-router';

// Interfaces
import { App } from './interfaces';

// Views
import DashboardView from './views/dashboard/dashboard';

import apps from './apps';

const mapRoutes = (app: App) => (route: RouteObject) => ({
	...route,
	path: `${app.name ? '/' + app.name : ''}${route.path}`
});

const flattedAppsRoutes = (app: App) =>
	app.routes.map(mapRoutes(app)).concat([
		{
			path: '/',
			element: <DashboardView />
		},
		{
			path: '*',
			element: <Navigate to='/' />
		}
	]);

export const routesConfig: Array<RouteObject> = apps.flatMap(flattedAppsRoutes);
