import { App, Route } from '../../interfaces';
import { lazy } from 'react';

// Views
const LoginView = lazy(() => import('./views/login'));
const ForgotPasswordView = lazy(() => import('./views/forgot-password-view'));
const CreatePasswordView = lazy(() => import('./views/create-password-view'));

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
