import { ID, Permissions } from '@services';

export interface Role {
	id: ID;
	name: string;
	permissions: Array<Permissions>;
	isActive: boolean;
}
