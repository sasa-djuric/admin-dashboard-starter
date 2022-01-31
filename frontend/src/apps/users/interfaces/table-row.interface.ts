import { User } from '../service';

export interface TableRow extends User {
	key: string | number;
	status: 'Active' | 'Inactive';
}
