// Libs
import { createService } from 'react-query-service';

// Types
import { ID, WithFilters } from '../types';
import { ResponseWithPagination } from '../interfaces';
import { User } from './interfaces';

// Utils
import { omit } from 'ramda';

import http from '../http';

function getAll() {
	return http.get<Array<User>>('/users');
}

function getAllPaginated(filters: WithFilters<any>) {
	return http.get<ResponseWithPagination<Array<User>>>('/users', { params: filters });
}

function getById(id: ID) {
	return http.get<User>(`/users/${id}`);
}

function create(data: Omit<User, 'id'>) {
	return http.post<User>('/users', data);
}

function update(data: Partial<User>) {
	return http.put<User>(`/users/${data.id}`, omit(['id'], data));
}

function remove(id: ID) {
	return http.delete<{ id: ID }>(`/users/${id}`);
}

export const usersService = createService({
	name: 'users',
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
