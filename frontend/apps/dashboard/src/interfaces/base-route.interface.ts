import { Permissions } from '@app/services';
import { ReactComponentReference } from '../types';

export interface BaseRoute {
  path: string;
  exact?: boolean;
  rerenderOnPathChange?: boolean;
  props?: Record<any, any>;
  permissions?: Array<Permissions>;
  component: ReactComponentReference;
}
