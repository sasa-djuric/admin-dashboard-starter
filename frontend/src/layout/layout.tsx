// Libs
import { FunctionComponent, useState } from 'react';

// Components
import { Layout as AntLayout } from 'antd';

// Hooks
import { Header } from './header';
import { Navigation } from './navigation';

const Layout: FunctionComponent = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<AntLayout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div className='logo' style={{ height: '60px' }} />
				<Navigation />
			</AntLayout.Sider>
			<AntLayout className='site-layout' style={{ maxHeight: '100vh' }}>
				<Header />
				<AntLayout.Content style={{ overflowY: 'auto' }}>{children}</AntLayout.Content>
			</AntLayout>
		</AntLayout>
	);
};

export default Layout;
