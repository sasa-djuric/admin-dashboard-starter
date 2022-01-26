import { notification } from 'antd';
import { Navigate, useParams, useNavigate } from 'react-router';
import CreatePasswordForm from '../../forms/create-password';
import Layout from '../../layout';

interface CreatePasswordViewProps {
	type: 'activation' | 'reset';
}

const CreatePasswordView: React.FunctionComponent<CreatePasswordViewProps> = ({ type }) => {
	const navigate = useNavigate();
	const { token } = useParams();

	function onSuccess() {
		const messages = {
			activation: 'Successful activation',
			reset: 'Successful password reset'
		};

		notification.info({
			message: messages[type]
		});

		navigate('/login');
	}

	if (!token) return <Navigate to='/login' />;

	return (
		<Layout>
			<CreatePasswordForm
				type={type}
				token={decodeURIComponent(token)}
				onSuccess={onSuccess}
			/>
		</Layout>
	);
};

export default CreatePasswordView;
