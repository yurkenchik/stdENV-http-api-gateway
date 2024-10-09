import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1727956881140 implements MigrationInterface {
    name = 'UpdateUserTable1727956881140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "certificateLink" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "certificateLink"`);
    }

}
