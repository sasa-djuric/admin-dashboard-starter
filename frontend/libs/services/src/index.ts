import { QueryClient } from 'react-query-service';

export * from './interfaces';
export * from './types';
export * from './mocks';
export { default as http } from './http';

let _queryClient: QueryClient;

export function getQueryClient(): QueryClient {
	return _queryClient;
}

export function init(queryClient: QueryClient) {
	_queryClient = queryClient;
}
