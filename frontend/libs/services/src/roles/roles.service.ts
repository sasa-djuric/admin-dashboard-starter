// Types
import { ID, WithFilters } from '../types';
import { ResponseWithPagination, Search, Sorting } from '../interfaces';
import { Role } from './interfaces';
import { RemoveResponse } from '../interfaces';

// Utils
import { omit } from 'ramda';

import http from '../http';

function getAll(filters?: Partial<Sorting & Search>) {
	return http.get<Array<Role>>('/roles', { params: filters });
}

function getAllPaginated(filters: WithFilters<any>) {
	return http.get<ResponseWithPagination<Array<Role>>>('/roles', { params: filters });
}

function getById(id: ID) {
	return http.get<Role>(`/roles/${id}`);
}

function create(data: Omit<Role, 'id'>) {
	return http.post<Role>('/roles', data);
}

function update(data: Partial<Role>) {
	return http.put<Role>(`/roles/${data.id}`, omit(['id'], data));
}

function remove(id: ID) {
	return http.delete<RemoveResponse>(`/roles/${id}`);
}

export default {
	getAll,
	getAllPaginated,
	getById,
	create,
	update,
	remove
} as const;
