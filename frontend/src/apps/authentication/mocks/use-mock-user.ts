import { useContext, useEffect } from 'react';
import { RolesPermissions } from '@apps/roles';
import { AuthenticatedUser, UsersPermissions } from '@apps/users';
import { AuthContext } from '../context';

const mockUser: AuthenticatedUser = {
	id: 1,
	name: 'Test User',
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
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('AuthContext should be used within AuthProvider');
	}

	const { actions } = context;

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			actions.login(user);
		}
	}, [user]);
}
