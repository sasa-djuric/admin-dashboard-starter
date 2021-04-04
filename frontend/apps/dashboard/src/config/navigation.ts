import {
  DashboardOutlined,
  BarsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Permissions } from '@app/services';
import { RolesPermissions } from '@app/services/roles/enums';
import { UsersPermissions } from '@app/services/users/enums';

export interface NavigationItem {
  title: string;
  icon: any;
  path?: string;
  subItems?: Array<NavigationItem>;
  permissions?: Array<Permissions>;
}

export type NavigationConfig = Array<NavigationItem>;

const navigation: NavigationConfig = [
  {
    title: 'Dashboard',
    icon: DashboardOutlined,
    path: '/',
  },
  {
    title: 'Users',
    icon: TeamOutlined,
    subItems: [
      {
        title: 'Users',
        icon: TeamOutlined,
        path: '/users',
        permissions: [UsersPermissions.Read],
      },
      {
        title: 'Roles',
        icon: BarsOutlined,
        path: '/roles',
        permissions: [RolesPermissions.Read],
      },
    ],
  },
];

export default navigation;
