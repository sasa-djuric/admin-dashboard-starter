import { Permissions } from '@services';
import usePermissions from '@apps/authentication/hooks/use-permissions';

interface ProtectedProps {
	permissions: Array<Permissions>;
}

const Protected: React.FunctionComponent<ProtectedProps> = ({ permissions, children }) => {
	const havePermission = usePermissions();

	if (!havePermission(permissions)) {
		return null;
	}

	return <>{children}</>;
};

export default Protected;
