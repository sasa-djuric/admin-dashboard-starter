import { Pagination, Search, Sorting } from '../interfaces';

export type WithFilters<T> = T & Partial<Pagination> & Partial<Sorting> & Partial<Search>;
