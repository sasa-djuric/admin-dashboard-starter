import { FiltersDto } from '../../dto/filters.dto';
import { WithFilters } from '../../types';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { applyFiltersAndExecute } from '../../utils';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
	async findMasterCategories(filters: FiltersDto): Promise<WithFilters<Array<Category>>> {
		const query = this.createQueryBuilder('categories').where({ isMaster: true });

		return applyFiltersAndExecute(query, filters, {
			searchFields: ['name', 'description']
		});
	}
}
