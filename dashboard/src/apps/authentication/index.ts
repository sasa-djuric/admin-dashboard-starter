import { App, Route } from 'src/interfaces';

// Views
import LoginView from './views/login';
import ForgotPasswordView from './views/forgot-password-view';
import ResetPasswordView from './views/reset-password-view';

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
		component: ResetPasswordView
	}
];

const app: App = {
	routes
};

export default app;
