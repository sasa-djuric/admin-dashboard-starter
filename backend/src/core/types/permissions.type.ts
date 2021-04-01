import { UsersPermissions } from '../../modules/users/enums';
import { RolesPermissions } from '../../modules/roles/enums';

export type Permissions = UsersPermissions | RolesPermissions;
