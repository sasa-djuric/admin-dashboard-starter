import { Permissions } from '@startup/services';
import { Redirect, Route, RouteProps } from 'react-router';
import usePermissions from 'src/hooks/use-permissions';

interface ProtectedRouteProps extends RouteProps {
	permissions?: Array<Permissions>;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({
	component: Component,
	render,
	permissions,
	...props
}) => {
	const havePermission = usePermissions();

	return (
		<Route
			{...props}
			render={props => {
				if (!Component || !havePermission(permissions)) return <Redirect to='/login' />;
				return <Component {...props} />;
			}}
		/>
	);
};

export default ProtectedRoute;
