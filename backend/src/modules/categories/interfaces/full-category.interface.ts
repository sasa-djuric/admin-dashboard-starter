import { Category } from '../category.entity';

export interface FullCategory extends Category {
	parentCategories: Array<number>;
	subcategories: Array<number>;
}
