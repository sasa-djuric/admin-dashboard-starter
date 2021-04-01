import './index.scss';
import '../node_modules/antd/dist/antd.css';

// Libs
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, ReactQueryDevtools } from 'react-query-service';
import { init, http } from '@startup/services';
import authenticationService from '@startup/services/authentication';

// Components
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Containers
import App from './app';

// Config
import queryClient from './config/query-client';

// Contexts
import AuthProvider from './contexts/auth/auth.context';

// if (process.env.NODE_ENV === 'development') {
// 	require('@startup/services/mocks').startMockServer();
// }

init(queryClient);

http.addListener(http.Event.TokenRefresh, () =>
	authenticationService.refreshAccessToken().then(
		token => {
			localStorage.setItem('token', token);
			return token;
		},
		err => {
			localStorage.removeItem('token');
		}
	)
);

Spin.setDefaultIndicator(<LoadingOutlined />);

ReactDOM.render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
