import { UsersPermissions } from '../../apps/users/service';
import { RolesPermissions } from '../../apps/roles/service';

export type Permissions = UsersPermissions | RolesPermissions;
