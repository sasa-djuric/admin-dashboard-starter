import { User } from '../interfaces';

export let usersDB: Array<User> = [
	{
		id: 1,
		name: 'John Doe',
		email: 'admin@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 2,
		name: 'Olive Yew',
		email: 'user@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 3,
		name: 'Aida Bugg',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 4,
		name: 'Maureen Biologist',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 5,
		name: 'Liz Erd',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 6,
		name: 'Allie Grater',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 7,
		name: 'Peg Legge',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 8,
		name: 'Teri Dactyl',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 9,
		name: 'Minnie Van Ryder',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 10,
		name: 'Lois Di Nominator',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 11,
		name: 'Constance Noring',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	},
	{
		id: 12,
		name: 'A. Mused',
		email: 'maintainer@startup.com',
		isActive: true,
		roleId: 1
	}
];

export const setUsersDB = (list: Array<User>) => {
	usersDB = list;
};
