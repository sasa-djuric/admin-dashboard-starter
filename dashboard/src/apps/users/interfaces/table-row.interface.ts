import { User } from '@startup/services/users';

export interface TableRow extends User {
	key: string | number;
	status: 'Active' | 'Inactive';
}
