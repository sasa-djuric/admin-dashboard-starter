// Assets
import { UserOutlined } from '@ant-design/icons';
import { grey } from '@ant-design/colors';

// Libs
import { FunctionComponent, useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import { Avatar, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import UserMenu from '../../containers/user-menu';

// Config
import navigation, { NavigationConfig } from '../../config/navigation';
import { AuthContext } from 'src/contexts/auth/auth.context';

const { Text } = Typography;
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const AppShell: FunctionComponent = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const [authState] = useContext(AuthContext);

	function findSelectedIndex(list: NavigationConfig, index?: number): number {
		const haveIndex = typeof index === 'number' && !Number.isNaN(index);

		for (let i = 0; i < list.length; i++) {
			if (list[i].subItems) {
				return (haveIndex ? index! : 1) * findSelectedIndex(list[i].subItems!, i);
			} else if (list[i].path!.length > 1 && window.location.pathname.includes(list[i].path!)) {
				return i + 1;
			}
		}

		return 0;
	}

	const selectedIndex = useMemo(() => findSelectedIndex(navigation), []);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div className='logo' style={{ height: '60px' }} />
				<Menu theme='dark' defaultSelectedKeys={[`main-menu-${selectedIndex}`]} mode='inline'>
					{navigation.map(({ title, icon: Icon, path, subItems }, index) => {
						if (!subItems) {
							return (
								<Menu.Item key={`main-menu-${index}`} icon={<Icon />}>
									<Link to={path!}>{title}</Link>
								</Menu.Item>
							);
						}

						return (
							<SubMenu key={`main-menu-${index}`} icon={<Icon />} title={title}>
								{subItems.map(({ title, icon: Icon, path }, subIndex) => {
									return (
										<Menu.Item
											key={`main-menu-${(subIndex + 1) * index}`}
											icon={<Icon />}
											title={title}
										>
											<Link to={path!}>{title}</Link>
										</Menu.Item>
									);
								})}
							</SubMenu>
						);
					})}
				</Menu>
			</Sider>
			<Layout className='site-layout' style={{ maxHeight: '100vh' }}>
				<Header
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
							style={{ marginLeft: 'auto', height: '36px', cursor: 'pointer' }}
						>
							<Avatar icon={<UserOutlined />} />
							<Text style={{ color: grey[1] }}>{authState.user?.name}</Text>
						</Space>
					</Dropdown>
				</Header>
				<Content style={{ overflowY: 'auto' }}>
					<div style={{ padding: 36, minHeight: 360 }}>{children}</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default AppShell;
