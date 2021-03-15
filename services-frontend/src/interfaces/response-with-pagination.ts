import { PaginationMetadata } from '.';

export interface ResponseWithPagination<T> {
	metadata: PaginationMetadata;
	data: T;
}
