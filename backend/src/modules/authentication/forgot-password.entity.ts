import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPassword {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	token: string;

	@CreateDateColumn()
	timestamp: string;
}
