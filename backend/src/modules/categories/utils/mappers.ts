export const mapParentCategoryIds = (list: Array<{ categoryId: number }> = []) =>
	list.map(({ categoryId }) => categoryId);

export const mapSubcategoryIds = (list: Array<{ subcategoryId: number }> = []) =>
	list.map(({ subcategoryId }) => subcategoryId);
