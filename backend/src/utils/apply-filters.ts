import { FiltersDto } from '../dto/filters.dto';
import { WithFilters } from '../types';
import { SelectQueryBuilder } from 'typeorm';
import { isNumber } from './isNumber';

const handleTransform = (result: any, transform?: (result: any) => void) =>
	typeof transform === 'function' ? transform(result) : result;

interface FilterOptions {
	searchFields?: Array<string>;
	transform?: (result: any) => void;
}

export async function applyFiltersAndExecute<T = any>(
	query: SelectQueryBuilder<any>,
	filters?: FiltersDto,
	options: FilterOptions = {}
): Promise<WithFilters<Array<T>>> {
	const shouldPaginate = isNumber(filters?.offset) && isNumber(filters?.limit);
	const shouldSort = filters?.orderBy && filters?.order;
	const shouldSearch = filters?.search && options.searchFields?.length;

	if (shouldSearch) {
		const searchQuery = options.searchFields.map(field => `${field} LIKE :search`).join(' OR ');
		query.andWhere(searchQuery, { search: `%${filters.search}%` });
	}

	if (shouldPaginate) {
		query.offset(filters.offset).limit(filters.limit);
	}

	if (shouldSort) {
		query.orderBy(filters.orderBy, filters.order);
	}

	if (shouldPaginate) {
		const queryResult = await query.execute();
		const [countResult] = await query.select('COUNT(1) as total').execute();

		return {
			metadata: {
				total: parseInt(countResult.total)
			},
			data: handleTransform(queryResult, options.transform)
		};
	}

	return query.execute().then(result => handleTransform(result, options.transform));
}
