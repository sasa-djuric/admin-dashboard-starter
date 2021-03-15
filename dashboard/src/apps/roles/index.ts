// Views
import RolesMainView from './views/main';
import RolesCreateView from './views/create';

// Interfaces
import { App, Route } from '../../interfaces';

const routes: Array<Route> = [
	{
		path: '/',
		component: RolesMainView,
		exact: true
	},
	{
		path: '/new',
		component: RolesCreateView
	},
	{
		path: '/:id/edit',
		props: {
			isEditMode: true
		},
		component: RolesCreateView,
		exact: true
	}
];

const app: App = {
	name: 'roles',
	routes
};

export default app;
