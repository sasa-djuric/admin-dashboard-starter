import { Role } from '../service';

export interface TableRow extends Role {
	key: string | number;
	status: 'Active' | 'Inactive';
}
