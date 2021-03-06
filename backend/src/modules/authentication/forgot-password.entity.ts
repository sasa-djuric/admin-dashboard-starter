import { ID } from '../../core/types';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ForgotPassword {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@OneToOne(() => User)
	userId: ID;

	@Column()
	token: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
