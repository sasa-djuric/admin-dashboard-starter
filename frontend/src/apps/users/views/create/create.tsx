// Libs
import { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router';

// Components
import { Card, PageHeader } from 'antd';
import ErrorBoundary from '@components/service-error-boundary';
import Spinner from '@components/spinner';

// Containers
import CreateUserForm from '../../forms/create';

// Layout
import { View } from '../../../../layout/view';

// Hooks
import { useAuth } from '@apps/authentication';

// Services
import { User } from '../../service';

interface CreateProps {
	isEditMode?: boolean;
}

const UsersCreateView: React.FunctionComponent<CreateProps> = ({ isEditMode }) => {
	const { authState, updateAuthState, refreshToken } = useAuth();
	const navigate = useNavigate();
	const params = useParams();
	const id = params.id ? +params.id : null;

	function onSubmit(promise: Promise<User>) {
		promise.then(async result => {
			if (result.id === authState.user?.id) {
				await refreshToken();
				updateAuthState();
			}

			navigate(-1);
		});
	}

	return (
		<View>
			<PageHeader
				ghost={false}
				title='Users'
				subTitle={!isEditMode ? 'Create new user' : 'Edit user'}
				style={{ marginBottom: '24px' }}
				onBack={() => navigate(-1)}
			/>
			<Card>
				<ErrorBoundary>
					<Suspense fallback={<Spinner />}>
						<CreateUserForm id={id} isEditMode={!!isEditMode} onSubmit={onSubmit} />
					</Suspense>
				</ErrorBoundary>
			</Card>
		</View>
	);
};

export default UsersCreateView;
