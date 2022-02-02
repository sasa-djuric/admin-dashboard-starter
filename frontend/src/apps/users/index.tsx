import { App } from '../../interfaces';
import { routes } from './routes';

export { UsersPermissions } from './service';
export type { AuthenticatedUser, User } from './service';

export default {
	routes
} as const as App;
