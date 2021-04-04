import { notification } from 'antd';
import { Redirect, RouteComponentProps } from 'react-router';
import CreatePasswordForm from '../../forms/create-password';
import AuthenticationPage from '../../templates/page';

interface CreatePasswordViewProps extends RouteComponentProps<{ token: string }> {
	type: 'activation' | 'reset';
}

const CreatePasswordView: React.FunctionComponent<CreatePasswordViewProps> = ({ type, match, history }) => {
	const token = match.params.token;

	function onSuccess() {
		const messages = {
			activation: 'Successful activation',
			reset: 'Successful password reset'
		};

		notification.info({
			message: messages[type]
		});

		history.push('/login');
	}

	if (!token) return <Redirect to='/login' />;

	return (
		<AuthenticationPage>
			<CreatePasswordForm type={type} token={decodeURIComponent(token)} onSuccess={onSuccess} />
		</AuthenticationPage>
	);
};

export default CreatePasswordView;
