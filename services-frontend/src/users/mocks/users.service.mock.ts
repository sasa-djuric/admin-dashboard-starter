import { rest } from 'msw';
import api from '../../config/api';
import { RESPONSE_DELAY } from '../../mocks/constants';
import { NotFoundException } from '../../mocks/errors';
import { handleFilters } from '../../mocks/utils';
import { WithFilters } from '../../types';
import { User } from '../interfaces';
import { setUsersDB, usersDB } from './users.db.mock';

const getAll = rest.get<WithFilters<any>>(`${api.baseURL}/users/`, (req, res, ctx) => {
	return res(ctx.delay(RESPONSE_DELAY), ctx.json(handleFilters(usersDB, req)));
});

const getById = rest.get<WithFilters<any>>(`${api.baseURL}/users/:id`, (req, res, ctx) => {
	const found = usersDB.find(user => user.id == req.params?.id);

	if (!found) {
		return res(ctx.delay(RESPONSE_DELAY), ctx.status(404), ctx.json(NotFoundException()));
	}

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(found));
});

const create = rest.post<Omit<User, 'id'>>(`${api.baseURL}/users/`, (req, res, ctx) => {
	const created = { id: usersDB.length, ...req.body };

	usersDB.push(created);

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(created));
});

const update = rest.put<User>(`${api.baseURL}/users/:id`, (req, res, ctx) => {
	const foundIndex = usersDB.findIndex(user => user.id == req.params?.id);
	const updated = { ...usersDB[foundIndex], ...req.body };

	usersDB[foundIndex] = updated;

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(updated));
});

const remove = rest.delete(`${api.baseURL}/users/:id`, (req, res, ctx) => {
	const isFound = !!usersDB.find(user => user.id == req.params?.id);

	if (!isFound) {
		return res(ctx.delay(RESPONSE_DELAY), ctx.status(404), ctx.json(NotFoundException()));
	}

	setUsersDB(usersDB.filter(user => user.id != req.params?.id));

	return res(ctx.delay(RESPONSE_DELAY), ctx.json({ id: req.params?.id }));
});

export default [getAll, getById, create, update, remove];
