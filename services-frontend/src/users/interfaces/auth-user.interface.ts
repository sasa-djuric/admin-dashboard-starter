import { Permissions } from '../../types';
import { User } from './user.interface';

export interface AuthenticatedUser extends User {
	permissions: Array<Permissions>;
}
