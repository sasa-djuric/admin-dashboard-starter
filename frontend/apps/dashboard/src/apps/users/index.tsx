import { lazy } from 'react';
import { RouteObject } from 'react-router';
import { UsersPermissions } from '@app/services/users/enums';
import { App } from '../../interfaces';
import ProtectedRoute from '../../components/protected-route';

// Views
const UsersMainView = lazy(() => import('./views/main'));
const UsersCreateView = lazy(() => import('./views/create'));

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: (
			<ProtectedRoute permissions={[UsersPermissions.Read]}>
				<UsersMainView />
			</ProtectedRoute>
		)
	},
	{
		path: '/new',
		element: (
			<ProtectedRoute permissions={[UsersPermissions.Create]}>
				<UsersCreateView />
			</ProtectedRoute>
		)
	},
	{
		path: '/:id/edit',
		element: (
			<ProtectedRoute permissions={[UsersPermissions.Update]}>
				<UsersCreateView isEditMode />
			</ProtectedRoute>
		)
	}
];

const app: App = {
	name: 'users',
	routes
};

export default app;
