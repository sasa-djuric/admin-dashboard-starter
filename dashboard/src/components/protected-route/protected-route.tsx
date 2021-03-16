import { Permissions } from '@startup/services';
import { Redirect, Route, RouteProps } from 'react-router';
import useAuth from 'src/hooks/use-auth';

interface ProtectedRouteProps extends RouteProps {
	permissions?: Array<Permissions>;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({
	component: Component,
	render,
	permissions,
	...props
}) => {
	const [authState] = useAuth();

	return (
		<Route
			{...props}
			render={props => {
				if (
					!Component ||
					(permissions && !permissions.every(permission => authState.user?.permissions?.includes(permission)))
				)
					return <Redirect to='/login' />;

				return <Component {...props} />;
			}}
		/>
	);
};

export default ProtectedRoute;
