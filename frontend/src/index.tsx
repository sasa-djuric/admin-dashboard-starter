// Libs
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

// Components
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ErrorBoundary from './components/service-error-boundary';

// Containers
import App from './app';

// Config
import queryClient from './config/query-client';
import { isDev, mockAPI } from './config/dev';

import Authentication from '@apps/authentication';

import './index.scss';
import 'antd/dist/antd.css';

if (isDev && mockAPI) {
	require('./services/mocks').startMockServer();
}

Spin.setDefaultIndicator(<LoadingOutlined />);

ReactDOM.render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<Authentication>
					<App />
				</Authentication>
			</ErrorBoundary>
		</QueryClientProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
