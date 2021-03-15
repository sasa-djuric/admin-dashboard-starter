import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRelationRepository } from './category-relation.repository';
import { CategoryRepository } from './category.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryRepository, CategoryRelationRepository])],
	providers: [CategoriesService],
	controllers: [CategoriesController]
})
export class CategoriesModule {}
