import { App, Route } from '../../interfaces';
import { UsersPermissions } from '@app/services/users/enums';
import { lazy } from 'react';

// Views
const UsersMainView = lazy(() => import('./views/main'));
const UsersCreateView = lazy(() => import('./views/create'));

const routes: Array<Route> = [
	{
		path: '/',
		component: UsersMainView,
		exact: true,
		permissions: [UsersPermissions.Read]
	},
	{
		path: '/new',
		component: UsersCreateView,
		permissions: [UsersPermissions.Create]
	},
	{
		path: '/:id/edit',
		props: {
			isEditMode: true
		},
		component: UsersCreateView,
		exact: true,
		permissions: [UsersPermissions.Update]
	}
];

const app: App = {
	name: 'users',
	routes
};

export default app;
