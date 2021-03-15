// Libs
import { useContext } from 'react';
import { RouteComponentProps } from 'react-router';

// Containers
import LoginForm from '../../forms/login';
import AuthenticationPage from '../../templates/page';

// Services
import { LoginResponse } from '@startup/services/authentication';

// Contexts
import { AuthContext } from 'src/contexts/auth/auth.context';
import { login } from 'src/contexts/auth/actions';

interface LoginProps extends RouteComponentProps {}

const LoginView: React.FunctionComponent<LoginProps> = ({ history }) => {
	const [_, dispatchAuth] = useContext(AuthContext);

	function onSuccess(data: LoginResponse) {
		localStorage.setItem('token', data.token);
		dispatchAuth(login(data.user));
		history.replace('/');
	}

	return (
		<AuthenticationPage>
			<LoginForm onSuccess={onSuccess} />
		</AuthenticationPage>
	);
};

export default LoginView;
