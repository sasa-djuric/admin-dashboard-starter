import { Permissions } from '@services';
import { Navigate } from 'react-router';
import { usePermissions } from '@apps/authentication';

interface ProtectedRouteProps {
	permissions?: Array<Permissions>;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({
	permissions,
	children
}) => {
	const havePermission = usePermissions();

	if (!havePermission(permissions)) {
		return <Navigate to='/' />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
