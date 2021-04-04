import { UsersPermissions } from '../users/enums';
import { RolesPermissions } from '../roles/enums';

export type Permissions = UsersPermissions | RolesPermissions;
