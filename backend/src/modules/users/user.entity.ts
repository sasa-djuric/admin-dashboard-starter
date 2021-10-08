import { ID } from '../../core/types';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Photo } from '../photos/photo.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column({ select: false, default: null })
	password: string;

	@Column()
	name: string;

	@ManyToOne(() => Role)
	@Column()
	roleId: ID;

	@Column({ nullable: true, default: null })
	@OneToOne(() => Photo)
	profileImageId: ID;

	@Column({ type: 'boolean', default: true })
	isActive: boolean;

	@Column({ type: 'boolean', default: false })
	isActivated: boolean;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
