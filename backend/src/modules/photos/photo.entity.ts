import { ID } from '../../core/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Photo {
	@PrimaryGeneratedColumn()
	id: ID;

	@Column()
	originalName: string;

	@Column()
	extension: string;

	@Column()
	filename: string;

	@Column()
	url: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
