// Libs
import { createService } from 'react-query-service';

// Types
import { ID, WithFilters } from '../types';
import { ResponseWithPagination } from '../interfaces';
import { Role } from './interfaces';

// Utils
import { omit } from 'ramda';

import http from '../http';

function getAll() {
	return http.get<Array<Role>>('/roles');
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
	return http.delete<{ id: ID }>(`/roles/${id}`);
}

export const usersService = createService({
	name: 'roles',
	queries: {
		getAll,
		getAllPaginated,
		getById
	},
	mutations: {
		create: {
			mutationFn: create,
			onSuccess: (result: any) => {
				usersService.queries.getById(result.id).setData(result);
				usersService.queries.getAll().invalidate();
				usersService.queries.getAllPaginated().invalidate();
			}
		},
		update: {
			mutationFn: update,
			onSuccess: (result: any) => {
				usersService.queries.getById(result.id).setData(result);
				usersService.queries
					.getAll()
					.setData(data => data?.map(user => (user.id === result.id ? result : user)));
				usersService.queries.getAllPaginated().invalidate();
			}
		},
		remove: {
			mutationFn: remove,
			onSuccess: (result: any) => {
				usersService.queries.getById(result?.id).invalidate();
				usersService.queries.getAll().invalidate();
				usersService.queries.getAllPaginated().invalidate();
			}
		}
	}
});

export default usersService;
