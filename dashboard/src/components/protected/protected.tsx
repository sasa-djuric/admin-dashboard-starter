import { Permissions } from '@startup/services';
import { Fragment } from 'react';
import useAuth from 'src/hooks/use-auth';

interface ProtectedProps {
	permissions: Array<Permissions>;
}

const Protected: React.FunctionComponent<ProtectedProps> = ({ permissions, children }) => {
	const [authState] = useAuth();

	if (!permissions.every(permission => authState.user?.permissions.includes(permission))) {
		return <Fragment />;
	}

	return <Fragment>{children}</Fragment>;
};

export default Protected;
