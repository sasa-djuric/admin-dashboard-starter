import { FiltersDto } from '../../dto/filters.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CategoryRelation } from './category-relation.entity';
import { applyFiltersAndExecute } from '../../utils';
import { WithFilters } from '../../types';
import { Category } from './category.entity';

@EntityRepository(CategoryRelation)
export class CategoryRelationRepository extends Repository<CategoryRelation> {
	findParentCategoriesIds(id: number): Promise<Array<number>> {
		const mapResult = result => result.map(({ categoryId }) => categoryId);
		return this.createQueryBuilder('t').where('subcategoryId = :id', { id }).getMany().then(mapResult);
	}

	findParentCategories(
		id: number,
		filters?: FiltersDto,
		withRelations?: boolean
	): Promise<WithFilters<Array<Category | number>>> {
		const query = this.createQueryBuilder('t').where('subcategoryId = :id', { id });
		const mapResult = result => result.map(result => (withRelations ? result.category : result.categoryId));

		if (withRelations) {
			query.leftJoinAndSelect('t.category', 'category');
		}

		return applyFiltersAndExecute(query, filters, {
			transform: mapResult,
			searchFields: ['name', 'description']
		});
	}

	findSubcategoriesIds(id: number): Promise<Array<number>> {
		const mapResult = result => result.map(({ subcategoryId }) => subcategoryId);
		return this.createQueryBuilder('t').where('categoryId = :id', { id }).getMany().then(mapResult);
	}

	findSubcategories(id: number, filters?: FiltersDto): Promise<WithFilters<Array<Category>>> {
		const query = this.createQueryBuilder('t')
			.where('categoryId = :id', { id })
			.leftJoinAndSelect('t.subcategory', 'subcategory');

		const mapResult = (result: Array<{ subcategory: Category }>) => result.map(({ subcategory }) => subcategory);

		return applyFiltersAndExecute<Category>(query, filters, {
			transform: mapResult,
			searchFields: ['name', 'description']
		});
	}

	createOrUpdateParents(id: number, parentList: Array<number>) {
		const createParentRelations = parentList?.map(parentCategoryId => ({
			categoryId: parentCategoryId,
			subcategoryId: id
		}));

		if (!createParentRelations?.length) {
			return Promise.resolve([]);
		}

		return this.save(createParentRelations);
	}

	createOrUpdateSub(id: number, subList: Array<number>) {
		const createSubRelations =
			subList?.map(subcategoryId => ({
				categoryId: id,
				subcategoryId: subcategoryId
			})) ?? [];

		if (!createSubRelations?.length) {
			return Promise.resolve([]);
		}

		return this.save(createSubRelations);
	}

	removeRelations(id: number) {
		return this.createQueryBuilder()
			.delete()
			.where('categoryId = :id OR subcategoryId = :id', {
				id
			})
			.execute();
	}
}
