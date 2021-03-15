// Views
import UsersMainView from './views/main';
import UsersCreateView from './views/create';

// Interfaces
import { App, Route } from '../../interfaces';

const routes: Array<Route> = [
	{
		path: '/',
		component: UsersMainView,
		exact: true
	},
	{
		path: '/new',
		component: UsersCreateView
	},
	{
		path: '/:id/edit',
		props: {
			isEditMode: true
		},
		component: UsersCreateView,
		exact: true
	}
];

const app: App = {
	name: 'users',
	routes
};

export default app;
