import { Permissions } from '@services';
import { Role } from '../interfaces';

export let rolesDB: Array<Role> = [
	{
		id: 1,
		name: 'Admin',
		isActive: true,
		permissions: [
			'users:create',
			'users:read',
			'users:update',
			'users:delete',
			'roles:create',
			'roles:read',
			'roles:update',
			'roles:delete'
		] as Array<Permissions>
	},
	{
		id: 2,
		name: 'User',
		isActive: true,
		permissions: ['users:update', 'roles:read'] as Array<Permissions>
	},
	{
		id: 3,
		name: 'Moderator',
		isActive: true,
		permissions: ['users:read', 'users:update', 'roles:read'] as Array<Permissions>
	}
];

export const setRolesDB = (list: Array<Role>) => {
	rolesDB = list;
};
