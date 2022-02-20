import HTTP from '../lib/http';
import { appConfig } from '@config/app';

export default new HTTP({ baseURL: appConfig.apiBaseURL });
