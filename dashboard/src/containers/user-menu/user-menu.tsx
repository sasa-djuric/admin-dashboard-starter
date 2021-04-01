// Libs
import { useContext } from 'react';
import { Menu } from 'antd';

// Assets
import { LogoutOutlined } from '@ant-design/icons';

// Context
import { AuthContext } from '@contexts/auth/auth.context';
import { logout } from '@contexts/auth/actions';

// Services
import authenticationService from '@startup/services/authentication';

const UserMenu = () => {
	const [_, dispatchAuth] = useContext(AuthContext);

	function onLogout() {
		localStorage.removeItem('token');
		authenticationService.logout();
		dispatchAuth(logout());
	}

	return (
		<Menu>
			<Menu.Item icon={<LogoutOutlined />} onClick={onLogout}>
				Logout
			</Menu.Item>
		</Menu>
	);
};

export default UserMenu;
