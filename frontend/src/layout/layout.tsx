// Assets
import { UserOutlined } from '@ant-design/icons';
import { grey } from '@ant-design/colors';

// Libs
import { Fragment, FunctionComponent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space, Typography } from 'antd';
import UserMenu from '../containers/user-menu';

// Config
import navigation, { NavigationConfig } from '@config/navigation';

// Hooks
import usePermissions from '@apps/authentication/hooks/use-permissions';
import useAuth from '@apps/authentication/hooks/use-auth';

const { Text } = Typography;
const { Header, Content, Sider } = AntLayout;
const { SubMenu } = Menu;

const Layout: FunctionComponent = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const { authState } = useAuth();
	const havePermission = usePermissions();

	function findSelectedIndex(list: NavigationConfig, index?: number): Array<number> {
		const haveIndex = typeof index === 'number' && !Number.isNaN(index);

		for (let i = 0; i < list.length; i++) {
			if (list[i].children) {
				const subIndexes = findSelectedIndex(list[i].children!, i);
				return [
					...subIndexes.slice(0, subIndexes.length - 1),
					(haveIndex ? index! : 1) * subIndexes[subIndexes.length - 1]
				];
			} else if (
				list[i].path!.length > 1 &&
				window.location.pathname.includes(list[i].path!)
			) {
				return [index!, i + 1];
			}
		}

		return [0];
	}

	const selectedIndex = useMemo(() => findSelectedIndex(navigation), []);

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div className='logo' style={{ height: '60px' }} />
				<Menu
					theme='dark'
					defaultSelectedKeys={[`main-menu-${selectedIndex[selectedIndex.length - 1]}`]}
					defaultOpenKeys={selectedIndex.map(index => `main-menu-${index}`)}
					mode='inline'
				>
					{navigation.map(
						({ title, icon, path, children: subItems, permissions }, index) => {
							if (!havePermission(permissions)) {
								return <Fragment />;
							}

							if (!subItems) {
								return (
									<Menu.Item key={`main-menu-${index}`} icon={icon}>
										<Link to={path!}>{title}</Link>
									</Menu.Item>
								);
							}

							return (
								<SubMenu key={`main-menu-${index}`} icon={icon} title={title}>
									{subItems.map(
										({ title, icon, path, permissions }, subIndex) => {
											if (!havePermission(permissions)) {
												return <Fragment />;
											}

											return (
												<Menu.Item
													key={`main-menu-sub-${(subIndex + 1) * index}`}
													icon={icon}
													title={title}
												>
													<Link to={path!}>{title}</Link>
												</Menu.Item>
											);
										}
									)}
								</SubMenu>
							);
						}
					)}
				</Menu>
			</Sider>
			<AntLayout className='site-layout' style={{ maxHeight: '100vh' }}>
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
							style={{
								marginLeft: 'auto',
								height: '36px',
								cursor: 'pointer'
							}}
						>
							<Avatar icon={<UserOutlined />} />
							<Text style={{ color: grey[1] }}>{authState.user?.name}</Text>
						</Space>
					</Dropdown>
				</Header>
				<Content style={{ overflowY: 'auto' }}>
					<div style={{ padding: 36, minHeight: 360 }}>{children}</div>
				</Content>
			</AntLayout>
		</AntLayout>
	);
};

export default Layout;
