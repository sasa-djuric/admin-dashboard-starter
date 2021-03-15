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

export function applyFiltersAndExecute<T = any>(
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
		return query.getManyAndCount().then(result => {
			return {
				metadata: {
					total: result[1]
				},
				data: handleTransform(result[0], options.transform)
			};
		});
	}

	return query.getMany().then(result => handleTransform(result, options.transform));
}
