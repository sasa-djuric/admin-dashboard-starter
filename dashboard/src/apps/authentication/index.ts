import { App, Route } from 'src/interfaces';

// Views
import LoginView from './views/login';
import ForgotPasswordView from './views/forgot-password-view';
import CreatePasswordView from './views/create-password-view';

const routes: Array<Route> = [
	{
		path: '/login',
		component: LoginView
	},
	{
		path: '/forgot-password',
		component: ForgotPasswordView
	},
	{
		path: '/reset-password/:token',
		component: CreatePasswordView,
		props: {
			type: 'reset'
		}
	},
	{
		path: '/activation/:token',
		component: CreatePasswordView,
		props: {
			type: 'activation'
		}
	}
];

const app: App = {
	routes
};

export default app;
