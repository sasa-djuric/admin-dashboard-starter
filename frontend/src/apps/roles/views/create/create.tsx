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
import { Role } from '../../service';

interface CreateProps {
	isEditMode?: boolean;
}

const RolesCreateView: React.FunctionComponent<CreateProps> = ({ isEditMode }) => {
	const navigate = useNavigate();
	const { authState, updateAuthState, refreshToken } = useAuth();
	const params = useParams();
	const id = params.id ? parseInt(params.id) : null;

	function onSubmit(promise: Promise<Role>) {
		promise.then(async result => {
			if (result.id === authState.user?.roleId) {
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
				title='Roles'
				subTitle={!isEditMode ? 'Create new role' : 'Edit role'}
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

export default RolesCreateView;
