import { App } from '../../interfaces';
import { routes } from './routes';

export { RolesPermissions } from './service';
export type { Role } from './service';

export default {
	routes
} as const as App;
