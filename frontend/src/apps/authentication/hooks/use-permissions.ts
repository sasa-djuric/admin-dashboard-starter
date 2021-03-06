import { Permissions } from '@services';
import { useAuth } from './use-auth';

export const usePermissions = () => {
	const { authState } = useAuth();

	function havePermission(permissions?: Array<Permissions>) {
		if (!permissions?.length) {
			return true;
		}

		return permissions.every(permission => authState.user?.permissions.includes(permission));
	}

	return havePermission;
};
