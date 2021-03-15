import { BaseRoute } from './base-route.interface';

export interface App {
	name?: string;
	routes: Array<BaseRoute>;
}
