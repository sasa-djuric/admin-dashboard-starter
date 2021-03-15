import { Role } from '@startup/services/roles';

export interface TableRow extends Role {
	key: string | number;
	status: 'Active' | 'Inactive';
}
