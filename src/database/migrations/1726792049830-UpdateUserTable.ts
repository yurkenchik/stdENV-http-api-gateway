import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1726792049830 implements MigrationInterface {
    name = 'UpdateUserTable1726792049830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAccountVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAccountVerified"`);
    }

}
