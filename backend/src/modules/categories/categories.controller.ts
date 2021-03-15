import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { FiltersDto } from '../../dto/filters.dto';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { GetCategoryByIdDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { GetSubcategoriesDto } from './dto/get-subcategories.dto';
import { RemoveCategoryDto } from './dto/remove.dto';
import { FullCategory } from './interfaces';
import { CSVToJSONPipe } from '../../pipes/csv-to-json.pipe';
import { ImportListDto } from './dto/importList.dto';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get('all')
	getAll(): Promise<Array<Category>> {
		return this.categoriesService.getAll();
	}

	@Get(':id')
	getById(@Param() params: GetCategoryByIdDto) {
		return this.categoriesService.getById(+params.id);
	}

	@Get(':id/all')
	getSubcategories(@Param() params: GetSubcategoriesDto, @Query() filters: FiltersDto) {
		if (params.id === 'master') {
			return this.categoriesService.getMasterCategories(filters);
		}

		return this.categoriesService.getSubcategories(+params.id, filters);
	}

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto): Promise<FullCategory> {
		return this.categoriesService.create(createCategoryDto);
	}

	@Post('import')
	import(
		@Body('file', new CSVToJSONPipe(), new ParseArrayPipe({ items: CreateCategoryDto, whitelist: true }))
		file: Array<CreateCategoryDto>
	): Promise<void> {
		return this.categoriesService.import(file);
	}

	@Put()
	update(@Body() updateCategoryDto: UpdateCategoryDto): Promise<FullCategory> {
		return this.categoriesService.update(updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param() removeCategoryDto: RemoveCategoryDto): Promise<{ id: number }> {
		return this.categoriesService.remove(+removeCategoryDto.id);
	}
}
