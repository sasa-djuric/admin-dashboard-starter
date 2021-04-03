// Libs
import { RouteComponentProps } from 'react-router';

// Containers
import LoginForm from '../../forms/login';
import AuthenticationPage from '../../templates/page';

// Services
import { LoginResponse } from '@startup/services/authentication';

// Hooks
import useAuth from 'src/hooks/use-auth';

interface LoginProps extends RouteComponentProps {}

const LoginView: React.FunctionComponent<LoginProps> = ({ history }) => {
	const { updateAuthState } = useAuth();

	function onSuccess(data: LoginResponse) {
		localStorage.setItem('token', data.token);
		updateAuthState();
		history.replace('/');
	}

	return (
		<AuthenticationPage>
			<LoginForm onSuccess={onSuccess} />
		</AuthenticationPage>
	);
};

export default LoginView;
