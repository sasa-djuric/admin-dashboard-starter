import { RestRequest } from 'msw';
import { isNil } from 'ramda';
import { sort } from './sort';

export const handleSort = (data: Array<any>, req: RestRequest<any>) => {
	const field = req.url.searchParams.get('field');
	const order = req.url.searchParams.get('order');
	const shouldSort = !isNil(field) && !isNil(order);

	return shouldSort ? sort(data, field!, order) : data;
};
