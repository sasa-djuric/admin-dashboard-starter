import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@Column('boolean', { nullable: false })
	isActive: boolean;

	@Column('json', { nullable: false })
	permissions: Array<string>;
}
