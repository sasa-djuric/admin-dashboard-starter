import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CategoriesModule } from './categories.module';
import { CategoriesService } from './categories.service';

describe('Cats', () => {
	let app: INestApplication;
	let categoriesService = { findAll: () => ['test'] };

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [CategoriesModule]
		})
			.overrideProvider(CategoriesService)
			.useValue(categoriesService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it(`/GET categories`, () => {
		return request(app.getHttpServer()).get('/categories').expect(200).expect({
			data: categoriesService.findAll()
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
