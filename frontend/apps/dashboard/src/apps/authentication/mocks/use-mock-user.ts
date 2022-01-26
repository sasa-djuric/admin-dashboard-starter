import { useContext, useEffect } from 'react';
import { RolesPermissions } from '@app/services/roles/enums';
import { AuthenticatedUser } from '@app/services/users';
import { UsersPermissions } from '@app/services/users/enums';
import { AuthContext } from '../context';

const mockUser: AuthenticatedUser = {
	id: 1,
	name: 'Test',
	email: 'test@user.com',
	isActive: true,
	permissions: [
		UsersPermissions.Create,
		UsersPermissions.Delete,
		UsersPermissions.Read,
		UsersPermissions.Update,
		RolesPermissions.Create,
		RolesPermissions.Delete,
		RolesPermissions.Read,
		RolesPermissions.Update
	],
	roleId: 1
};

export function useMockUser(user: AuthenticatedUser = mockUser) {
	const { actions } = useContext(AuthContext);

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			actions.login(user);
		}
	}, [user]);
}
