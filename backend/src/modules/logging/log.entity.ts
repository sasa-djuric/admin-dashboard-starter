import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { LogLevel } from './log-level.enum';

@Entity()
export class Log {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'enum', enum: LogLevel })
	level: LogLevel;

	@Column()
	message: string;

	@Column()
	context: string;

	@Column({ type: 'longtext', nullable: true })
	trace: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;
}
