import { notification } from 'antd';
import { Redirect, RouteComponentProps } from 'react-router';
import ResetPasswordForm from '../../forms/reset-password';
import AuthenticationPage from '../../templates/page';

interface ResetPasswordViewProps extends RouteComponentProps<{ token: string }> {}

const ResetPasswordView: React.FunctionComponent<ResetPasswordViewProps> = ({ match, history }) => {
	const token = match.params.token;

	function onSuccess() {
		notification.info({
			message: 'Successful password reset'
		});
		history.push('/login');
	}

	if (!token) return <Redirect to='/login' />;

	return (
		<AuthenticationPage>
			<ResetPasswordForm token={token} onSuccess={onSuccess} />
		</AuthenticationPage>
	);
};

export default ResetPasswordView;
