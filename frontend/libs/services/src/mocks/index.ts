import { setupWorker } from 'msw';
import authenticationService from '../authentication/mocks';
import usersService from '../users/mocks';
import rolesService from '../roles/mocks';

const worker = setupWorker(...authenticationService, ...usersService, ...rolesService);

export function startMockServer() {
	worker.start({
		serviceWorker: {
			url: `/mockServiceWorker.js`
		}
	});
}
