import { setupWorker } from 'msw';
// import validateHomePageURL from './utils/validate-home-page-url';
// import packageConfig from '../../../package.json';
import authenticationService from '../authentication/mocks';
import usersService from '../users/mocks';
import rolesService from '../roles/mocks';

const worker = setupWorker(...authenticationService, ...usersService, ...rolesService);

export function startMockServer() {
	const homepage = /*validateHomePageURL(packageConfig.homepage) ||*/ '/';

	// if (window.location.pathname !== homepage) {
	// 	window.location.replace(homepage);
	// }

	worker.start({
		serviceWorker: {
			url: `${homepage}mockServiceWorker.js`
		}
	});
}
