import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from '../../src/guards/authentication.guard';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';

function createTestModule(guard) {
	return Test.createTestingModule({
		imports: [AppModule],
		providers: [
			{
				provide: APP_GUARD,
				useValue: guard
			}
		]
	}).compile();
}

describe('Authentication Guard', () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = (await createTestModule(new AuthenticationGuard())).createNestApplication();
		await app.init();
	});

	it(`should prevent access (unauthorized)`, async () => {
		return request(app.getHttpServer()).get('/roles').set('Authorization', 'Bearer test-header').expect(401);
	});
});
