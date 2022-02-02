import { Avatar, Dropdown, Space, Layout, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { grey } from '@ant-design/colors';
import { useAuth } from '@apps/authentication';
import UserMenu from '../../containers/user-menu';

interface HeaderProps {}

export const Header: React.FunctionComponent<HeaderProps> = props => {
	const { authState } = useAuth();

	return (
		<Layout.Header
			style={{
				display: 'flex',
				alignItems: 'center',
				padding: '12px 42px'
			}}
		>
			<Dropdown overlay={<UserMenu />} placement='bottomCenter'>
				<Space
					className='app-shell__user'
					align='center'
					style={{
						marginLeft: 'auto',
						height: '36px',
						cursor: 'pointer'
					}}
				>
					<Avatar icon={<UserOutlined />} />
					<Typography.Text style={{ color: grey[1] }}>
						{authState.user?.name}
					</Typography.Text>
				</Space>
			</Dropdown>
		</Layout.Header>
	);
};
