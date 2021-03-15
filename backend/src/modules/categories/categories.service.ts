import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'ramda';
import { UpdateCategoryDto } from './dto';
import { CreateCategoryDto } from './dto/create.dto';
import { mapParentCategoryIds, mapSubcategoryIds } from './utils';
import { CategoryRepository } from './category.repository';
import { CategoryRelationRepository } from './category-relation.repository';
import { FullCategory } from './interfaces';
import { Category } from './category.entity';
import { FiltersDto } from '../../dto/filters.dto';
import { WithFilters } from '../../types';
import { ImportListDto } from './dto/importList.dto';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(CategoryRepository)
		private readonly categoryRepository: CategoryRepository,
		@InjectRepository(CategoryRelationRepository)
		private readonly categoryRelationRepository: CategoryRelationRepository
	) {}

	async getById(id: number): Promise<FullCategory> {
		try {
			const category = await this.categoryRepository.findOneOrFail(id);
			const parentCategories = await this.categoryRelationRepository.findParentCategoriesIds(id);
			const subcategories = await this.categoryRelationRepository.findSubcategoriesIds(id);

			return {
				...category,
				parentCategories,
				subcategories
			};
		} catch {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}
	}

	async getMasterCategories<Filters extends FiltersDto>(filters: Filters): Promise<WithFilters<Array<Category>>> {
		return this.categoryRepository.findMasterCategories(filters);
	}

	async getSubcategories(id: number, filters: FiltersDto): Promise<WithFilters<Array<Category>>> {
		return this.categoryRelationRepository.findSubcategories(id, filters);
	}

	async getAll(): Promise<Array<Category>> {
		return this.categoryRepository.find();
	}

	async create(data: CreateCategoryDto): Promise<FullCategory> {
		const createdCategory = this.categoryRepository.create(omit(['parentCategories', 'subcategories'], data));

		await this.categoryRepository.insert(createdCategory);

		const parentCategories = await this.categoryRelationRepository.createOrUpdateParents(
			createdCategory.id,
			data.parentCategories
		);

		const subcategories = await this.categoryRelationRepository.createOrUpdateParents(
			createdCategory.id,
			data.subcategories
		);

		return {
			...createdCategory,
			parentCategories: mapParentCategoryIds(parentCategories),
			subcategories: mapSubcategoryIds(subcategories)
		};
	}

	async import(data: Array<CreateCategoryDto>) {
		return;
	}

	async update(data: UpdateCategoryDto): Promise<FullCategory> {
		const updateData = omit(['id', 'parentCategories', 'subcategories'], data);
		const updateResult = await this.categoryRepository.update(data.id, updateData);

		if (!updateResult.affected) {
			throw new NotFoundException(`Category with ID ${data.id} not found`);
		}

		const updatedCategory = await this.getById(data.id);

		const parentCategories = await this.categoryRelationRepository.createOrUpdateParents(
			updatedCategory.id,
			data.parentCategories
		);

		const subcategories = await this.categoryRelationRepository.createOrUpdateParents(
			updatedCategory.id,
			data.subcategories
		);

		return {
			...updatedCategory,
			parentCategories: mapParentCategoryIds(parentCategories),
			subcategories: mapSubcategoryIds(subcategories)
		};
	}

	async remove(id: number): Promise<{ id: number }> {
		await this.categoryRelationRepository.removeRelations(id);
		const result = await this.categoryRepository.delete(id);

		if (!result.affected) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}

		return {
			id
		};
	}
}
