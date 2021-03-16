import { ID } from '../../types';

export interface User {
	id: ID;
	email: string;
	name: string;
	profileImage?: string | null;
	role: ID;
	isActive: boolean;
}
