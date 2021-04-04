import { createClient } from 'react-query-service';

const queryClient = createClient({
	defaultOptions: {
		queries: {
			staleTime: Number.MAX_SAFE_INTEGER
		}
	}
});

export default queryClient;
