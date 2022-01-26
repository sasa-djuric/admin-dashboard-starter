import { notification } from 'antd';
import { useNavigate } from 'react-router';
import ForgotPasswordForm from '../../forms/forgot-password/forgot-password';
import Layout from '../../layout';

interface ForgotPasswordViewProps {}

const ForgotPasswordView: React.FunctionComponent<ForgotPasswordViewProps> = () => {
	const navigate = useNavigate();

	function onSuccess() {
		notification.info({
			message: 'Check your e-mail for reset link'
		});
		navigate('/login');
	}

	return (
		<Layout>
			<ForgotPasswordForm onSuccess={onSuccess} />
		</Layout>
	);
};

export default ForgotPasswordView;
