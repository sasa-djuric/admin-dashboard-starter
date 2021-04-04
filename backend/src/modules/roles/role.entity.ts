import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@Column('json', { nullable: false })
	permissions: Array<string>;

	@Column('boolean', { nullable: true })
	isActive: boolean;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
