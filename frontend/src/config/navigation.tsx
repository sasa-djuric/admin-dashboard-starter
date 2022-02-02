import { DashboardOutlined, BarsOutlined, TeamOutlined } from '@ant-design/icons';
import { Permissions } from '@services';
import { RolesPermissions } from '@apps/roles';
import { UsersPermissions } from '@apps/users';

export interface NavigationItem {
	title: string;
	icon: React.ReactNode;
	path?: string;
	children?: Array<NavigationItem>;
	permissions?: Array<Permissions>;
}

export type NavigationConfig = Array<NavigationItem>;

const navigation: NavigationConfig = [
	{
		title: 'Dashboard',
		icon: <DashboardOutlined />,
		path: '/'
	},
	{
		title: 'Users',
		icon: <TeamOutlined />,
		children: [
			{
				title: 'Users',
				icon: <TeamOutlined />,
				path: '/users',
				permissions: [UsersPermissions.Read]
			},
			{
				title: 'Roles',
				icon: <BarsOutlined />,
				path: '/roles',
				permissions: [RolesPermissions.Read]
			}
		]
	}
];

export default navigation;
