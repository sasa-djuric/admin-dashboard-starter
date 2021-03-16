// Views
import RolesMainView from './views/main';
import RolesCreateView from './views/create';

// Interfaces
import { App, Route } from '../../interfaces';
import { RolesPermissions } from '@startup/services/roles/enums';

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
