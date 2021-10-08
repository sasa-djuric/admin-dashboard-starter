import { UserWithPermissions } from '../../../modules/users/interface/user-with-permissions.interface';

export interface AuthUser extends Omit<UserWithPermissions, 'password'> {}
