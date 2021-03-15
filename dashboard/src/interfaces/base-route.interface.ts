import { ReactComponentReference } from '../types';

export interface BaseRoute {
	path: string;
	exact?: boolean;
	rerenderOnPathChange?: boolean;
	props?: Record<any, any>;
	component: ReactComponentReference;
}
