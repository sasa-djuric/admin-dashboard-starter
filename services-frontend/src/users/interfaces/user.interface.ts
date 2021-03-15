import { Permissions } from '../../roles/types';
import { ID } from '../../types';

export interface User {
	id: ID;
	email: string;
	name: string;
	profileImage?: string | null;
	permissions: Array<Partial<Permissions>>;
	isActive: boolean;
}
