import { setupWorker } from 'msw';
import authenticationService from '@apps/authentication/service/mocks';
import usersService from '@apps/users/service/mocks';
import rolesService from '@apps/roles/service/mocks';

const worker = setupWorker(...authenticationService, ...usersService, ...rolesService);

export function startMockServer() {
	worker.start({
		serviceWorker: {
			url: `/mockServiceWorker.js`
		}
	});
}
