import { RouteObject } from 'react-router';
import { RolesPermissions } from '@app/services/roles/enums';
import { lazy } from 'react';
import ProtectedRoute from '../../components/protected-route';

// Views
const RolesMainView = lazy(() => import('./views/main'));
const RolesCreateView = lazy(() => import('./views/create'));

export const routes: Array<RouteObject> = [
	{
		path: '/roles',
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute permissions={[RolesPermissions.Read]}>
						<RolesMainView />
					</ProtectedRoute>
				)
			},
			{
				path: 'new',
				element: (
					<ProtectedRoute permissions={[RolesPermissions.Create]}>
						<RolesCreateView />
					</ProtectedRoute>
				)
			},
			{
				path: ':id/edit',
				element: (
					<ProtectedRoute permissions={[RolesPermissions.Update]}>
						<RolesCreateView isEditMode />
					</ProtectedRoute>
				)
			}
		]
	}
];
