import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1615219050588 implements MigrationInterface {
	name = 'migration1615219050588';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			"ALTER TABLE `category` CHANGE `type` `type` enum ('None', 'Practitioner', 'Health Center', 'Restaurant') NOT NULL DEFAULT 'None'"
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			"ALTER TABLE `category` CHANGE `type` `type` enum ('None', 'Practitioner', 'Health Center', 'Restaurant') NOT NULL"
		);
	}
}
