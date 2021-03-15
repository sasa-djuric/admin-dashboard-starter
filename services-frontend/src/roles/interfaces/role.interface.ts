import { ID } from '../../types';
import { Permissions } from '../../types';

export interface Role {
	id: ID;
	name: string;
	permissions: Array<Permissions>;
	isActive: boolean;
}
