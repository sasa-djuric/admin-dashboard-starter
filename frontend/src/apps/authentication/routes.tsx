import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router';

const LoginView = lazy(() => import('./views/login'));
const ForgotPasswordView = lazy(() => import('./views/forgot-password-view'));
const CreatePasswordView = lazy(() => import('./views/create-password-view'));

export const routesConfig: Array<RouteObject> = [
	{
		path: '/login',
		element: <LoginView />
	},
	{
		path: '/forgot-password',
		element: <ForgotPasswordView />
	},
	{
		path: '/reset-password/:token',
		element: <CreatePasswordView type='reset' />
	},
	{
		path: '/activation/:token',
		element: <CreatePasswordView type='activation' />
	},
	{
		path: '*',
		element: <Navigate to='/login' />
	}
];
