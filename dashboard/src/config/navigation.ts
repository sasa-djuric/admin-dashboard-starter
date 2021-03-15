import { DashboardOutlined, BarsOutlined, TeamOutlined } from '@ant-design/icons';

export interface NavigationItem {
	title: string;
	icon: any;
	path?: string;
	subItems?: Array<NavigationItem>;
}

export type NavigationConfig = Array<NavigationItem>;

const navigation: NavigationConfig = [
	{
		title: 'Dashboard',
		icon: DashboardOutlined,
		path: '/'
	},
	{
		title: 'Users',
		icon: TeamOutlined,
		subItems: [
			{
				title: 'Users',
				icon: TeamOutlined,
				path: '/users'
			},
			{
				title: 'Roles',
				icon: BarsOutlined,
				path: '/roles'
			}
		]
	}
];

export default navigation;
