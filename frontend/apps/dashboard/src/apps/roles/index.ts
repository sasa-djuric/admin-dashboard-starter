import { App, Route } from '../../interfaces';
import { RolesPermissions } from '@app/services/roles/enums';
import { lazy } from 'react';

// Views
const RolesMainView = lazy(() => import('./views/main'));
const RolesCreateView = lazy(() => import('./views/create'));

const routes: Array<Route> = [
	{
		path: '/',
		component: RolesMainView,
		exact: true,
		permissions: [RolesPermissions.Read]
	},
	{
		path: '/new',
		component: RolesCreateView,
		permissions: [RolesPermissions.Create]
	},
	{
		path: '/:id/edit',
		props: {
			isEditMode: true
		},
		component: RolesCreateView,
		exact: true,
		permissions: [RolesPermissions.Update]
	}
];

const app: App = {
	name: 'roles',
	routes
};

export default app;
