import { setupContextRequest } from '../utils/test';
import { RolesPermissions } from '../../modules/roles/enums';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
	it('should be defined', () => {
		expect(new PermissionsGuard()).toBeDefined();
	});

	it('should prevent accesss', () => {
		expect(() =>
			new PermissionsGuard(RolesPermissions.Create).canActivate(
				setupContextRequest({
					user: {
						permissions: [RolesPermissions.Read]
					}
				})
			)
		).toThrowError();

		expect(() =>
			new PermissionsGuard(RolesPermissions.Create, RolesPermissions.Read).canActivate(
				setupContextRequest({
					user: {
						permissions: [RolesPermissions.Read]
					}
				})
			)
		).toThrowError();
	});

	it('should allow accesss', () => {
		expect(
			new PermissionsGuard(RolesPermissions.Read).canActivate(
				setupContextRequest({
					user: {
						permissions: [RolesPermissions.Read]
					}
				})
			)
		).toBeTruthy();

		expect(
			new PermissionsGuard(RolesPermissions.Read).canActivate(
				setupContextRequest({
					user: {
						permissions: [RolesPermissions.Read, RolesPermissions.Update]
					}
				})
			)
		).toBeTruthy();
	});
});
