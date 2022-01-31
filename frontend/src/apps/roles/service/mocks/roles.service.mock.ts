import { rest } from 'msw';
import { appConfig } from '../../../../config/app';
import { RESPONSE_DELAY } from '@services/mocks/constants';
import { NotFoundException } from '@services/mocks/errors';
import { handleFilters } from '@services/mocks/utils';
import { WithFilters } from '@services/types';
import { Role } from '../interfaces';
import { setRolesDB, rolesDB } from './roles.db.mock';

const getAll = rest.get<WithFilters<any>>(`${appConfig.apiBaseURL}/roles`, (req, res, ctx) => {
	return res(ctx.delay(RESPONSE_DELAY), ctx.json(handleFilters(rolesDB, req)));
});

const getById = rest.get<WithFilters<any>>(`${appConfig.apiBaseURL}/roles/:id`, (req, res, ctx) => {
	const found = rolesDB.find(user => user.id == req.params?.id);

	if (!found) {
		return res(ctx.delay(RESPONSE_DELAY), ctx.status(404), ctx.json(NotFoundException()));
	}

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(found));
});

const create = rest.post<Omit<Role, 'id'>>(`${appConfig.apiBaseURL}/roles`, (req, res, ctx) => {
	const created = { id: rolesDB.length, ...req.body };

	rolesDB.push(created);

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(created));
});

const update = rest.put<Role>(`${appConfig.apiBaseURL}/roles/:id`, (req, res, ctx) => {
	const foundIndex = rolesDB.findIndex(user => user.id == req.params?.id);
	const updated = { ...rolesDB[foundIndex], ...req.body };

	rolesDB[foundIndex] = updated;

	return res(ctx.delay(RESPONSE_DELAY), ctx.json(updated));
});

const remove = rest.delete(`${appConfig.apiBaseURL}/roles/:id`, (req, res, ctx) => {
	const isFound = !!rolesDB.find(user => user.id == req.params?.id);

	if (!isFound) {
		return res(ctx.delay(RESPONSE_DELAY), ctx.status(404), ctx.json(NotFoundException()));
	}

	setRolesDB(rolesDB.filter(user => user.id != req.params?.id));

	return res(ctx.delay(RESPONSE_DELAY), ctx.json({ id: req.params?.id }));
});

export default [getAll, getById, create, update, remove] as const;
