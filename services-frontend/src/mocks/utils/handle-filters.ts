import { RestRequest } from 'msw';
import { handlePagination } from './handle-pagination';
import { handleSort } from './handle-sort';

export const handleFilters = (data: any, req: RestRequest<any>) => handlePagination(handleSort(data, req), req);
