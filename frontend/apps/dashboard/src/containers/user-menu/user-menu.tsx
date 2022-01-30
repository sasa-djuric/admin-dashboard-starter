// Libs
import { Menu } from 'antd';

// Assets
import { LogoutOutlined } from '@ant-design/icons';

// Hooks
import useAuth from '../../apps/authentication/hooks/use-auth';

const UserMenu = () => {
	const { logout } = useAuth();

	return (
		<Menu>
			<Menu.Item key='logout' icon={<LogoutOutlined />} onClick={logout}>
				Logout
			</Menu.Item>
		</Menu>
	);
};

export default UserMenu;
