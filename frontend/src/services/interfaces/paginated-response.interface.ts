import { PaginationMetadata } from '.';

export interface PaginatedResponse<T> {
	metadata: PaginationMetadata;
	data: T;
}
