// Types
import { PaginatedResponse, Search, Sorting, ID, WithFilters } from '@services';
import { User } from './interfaces';

// Utils
import { omit } from 'ramda';
import { toFormData } from '@services/utils';

import http from '@services/http';

function getAll(filters?: Partial<Search & Sorting>) {
	return http.get<Array<User>>('/users', { params: filters });
}

function getAllPaginated(filters: WithFilters<any>) {
	return http.get<PaginatedResponse<Array<User>>>('/users', { params: filters });
}

function getById(id: ID) {
	return http.get<User>(`/users/${id}`);
}

function create(data: Omit<User, 'id'>) {
	return http.post<User>('/users', toFormData(data));
}

function update(data: Partial<User>) {
	return http.put<User>(`/users/${data.id}`, toFormData(omit(['id'], data)));
}

function remove(id: ID) {
	return http.delete<{ id: ID }>(`/users/${id}`);
}

export interface SwithRoleRequest {
	id: ID;
	roleId: ID;
}

function swithRole(data: SwithRoleRequest) {
	return http.post<void>('/users/role/switch', data);
}

export default {
	getAll,
	getAllPaginated,
	getById,
	create,
	update,
	remove,
	swithRole
} as const;
