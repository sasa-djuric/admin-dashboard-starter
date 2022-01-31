import { RestRequest } from 'msw';
import { isNil } from 'ramda';
import { paginate } from './paginate';

export const handlePagination = (data: Array<any>, req: RestRequest<any>) => {
	const offset = req.url.searchParams.get('offset');
	const limit = req.url.searchParams.get('limit');
	const shouldPaginate = !isNil(offset) && !isNil(limit);

	return shouldPaginate ? { metadata: { total: data.length }, data: paginate(data, +offset!, +limit!) } : data;
};
