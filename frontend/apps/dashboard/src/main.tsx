/* eslint-disable @typescript-eslint/no-var-requires */
import './main.scss';
import '../../../node_modules/antd/dist/antd.css';

// Libs
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query-service';
import { init } from '@app/services';

// Components
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ErrorBoundary from './components/service-error-boundary';

// Containers
import App from './app';

// Config
import queryClient from './config/query-client';
import { isDev, mockAPI } from './config/dev';

import Authentication from './apps/authentication';

if (isDev && mockAPI) {
	require('@app/services/mocks').startMockServer();
}

init(queryClient);

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
