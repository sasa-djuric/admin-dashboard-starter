import { notification } from 'antd';
import { RouteComponentProps } from 'react-router';
import ForgotPasswordForm from '../../forms/forgot-password/forgot-password';
import AuthenticationPage from '../../templates/page';

interface ForgotPasswordViewProps extends RouteComponentProps {}

const ForgotPasswordView: React.FunctionComponent<ForgotPasswordViewProps> = ({ history }) => {
	function onSuccess() {
		notification.info({
			message: 'Check your e-mail for reset link'
		});
		history.push('/login');
	}

	return (
		<AuthenticationPage>
			<ForgotPasswordForm onSuccess={onSuccess} />
		</AuthenticationPage>
	);
};

export default ForgotPasswordView;
