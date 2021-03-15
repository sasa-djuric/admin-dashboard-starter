// Libs
import { useContext } from 'react';
import { Menu } from 'antd';

// Assets
import { LogoutOutlined } from '@ant-design/icons';

// Context
import { AuthContext } from 'src/contexts/auth/auth.context';
import { logout } from 'src/contexts/auth/actions';

// Services
import authenticationService from '@startup/services/authentication';
import { useHistory } from 'react-router';

const UserMenu = () => {
	const [_, dispatchAuth] = useContext(AuthContext);
	const history = useHistory();

	function onLogout() {
		localStorage.removeItem('token');
		authenticationService.logout();
		dispatchAuth(logout());
		history.push('/login');
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
