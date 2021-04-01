import { Permissions } from 'src/types';
import { User } from '../user.entity';

export interface UserWithPermissions extends User {
	permissions: Array<Permissions>;
	profileImage: string;
}
