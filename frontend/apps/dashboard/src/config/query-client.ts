import { createClient } from 'react-query-service';

const queryClient = createClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY
		}
	}
});

export default queryClient;
