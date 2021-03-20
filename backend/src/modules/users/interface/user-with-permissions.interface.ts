import { Permissions } from 'src/types';
import { User } from '../user.entity';

export interface UserWithPermissions extends Omit<User, 'roleId'> {
	permissions: Array<Permissions>;
}
