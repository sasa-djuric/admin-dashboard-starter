// Libs
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

// Components
import Spinner from './components/spinner';
import ErrorBoundary from './components/service-error-boundary';

// Containers
import Layout from './layout/layout';

import { routesConfig } from './routes';

function App() {
	const routes = useRoutes(routesConfig);

	return (
		<Layout>
			<ErrorBoundary>
				<Suspense fallback={<Spinner size='large' />}>{routes}</Suspense>
			</ErrorBoundary>
		</Layout>
	);
}

export default App;
