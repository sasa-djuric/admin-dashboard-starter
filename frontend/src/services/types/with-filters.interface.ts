import { Pagination, Search, Sorting } from '../interfaces';

export type WithFilters<T> = T & Partial<Pagination & Sorting & Search>;
