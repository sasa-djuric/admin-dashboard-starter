import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class CategoryRelation {
	@ManyToOne(type => Category, category => category.id)
	category: number;

	@ManyToOne(type => Category, category => category.id)
	subcategory: number;

	@PrimaryColumn()
	categoryId: number;

	@Column()
	subcategoryId: number;
}
