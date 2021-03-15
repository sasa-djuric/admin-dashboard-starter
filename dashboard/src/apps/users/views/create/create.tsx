// Libs
import { Suspense } from 'react';
import { RouteComponentProps } from 'react-router';

// Components
import { Card, PageHeader } from 'antd';
import ErrorBoundary from '@components/service-error-boundary';
import Spinner from '@components/spinner';

// Containers
import CreateUserForm from '../../forms/create';

interface Params {
	id?: string;
}

interface CreateProps extends RouteComponentProps<Params> {
	isEditMode?: boolean;
}

const UsersCreateView: React.FunctionComponent<CreateProps> = ({ isEditMode, history, match }) => {
	const id = match.params.id ? +match.params.id : null;

	function onSubmit(promise: Promise<any>) {
		promise.then(() => {
			history.goBack();
		});
	}

	return (
		<div>
			<PageHeader
				ghost={false}
				title='Users'
				subTitle={!isEditMode ? 'Create new user' : 'Edit user'}
				style={{ marginBottom: '24px' }}
				onBack={() => history.goBack()}
			/>
			<Card>
				<ErrorBoundary>
					<Suspense fallback={<Spinner />}>
						<CreateUserForm id={id} isEditMode={!!isEditMode} onSubmit={onSubmit} />
					</Suspense>
				</ErrorBoundary>
			</Card>
		</div>
	);
};

export default UsersCreateView;
