import App from './app';
import AuthProvider from './context';

const Authentication: React.FunctionComponent = ({ children }) => {
	return (
		<AuthProvider>
			<App>{children}</App>
		</AuthProvider>
	);
};

export default Authentication;
