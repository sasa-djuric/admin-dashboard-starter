import { Permissions } from '../../../core/types';
import { User } from '../user.entity';

export interface UserWithPermissions extends User {
	permissions: Array<Permissions>;
	profileImage: string;
}
