import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryType } from './categories.type.enum';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 20 })
	name: string;

	@Column('text')
	description: string;

	@Column({ type: 'enum', enum: CategoryType /*, default: CategoryType.None*/ })
	@Transform(({ value }) => (value ? value : CategoryType.None))
	type: CategoryType | null;

	@Column('text')
	icon: string;

	@Column('text', { nullable: true })
	banner: string;

	@Column('boolean')
	isMaster: boolean;

	@Column('boolean')
	isActive: boolean;
}
