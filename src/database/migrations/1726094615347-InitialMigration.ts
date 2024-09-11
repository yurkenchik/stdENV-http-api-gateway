import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1726094615347 implements MigrationInterface {
    name = 'InitialMigration1726094615347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_role_enum" AS ENUM('Student', 'Administrator', 'Teacher', 'Owner')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."role_role_enum" NOT NULL DEFAULT 'Student', CONSTRAINT "UQ_367aad98203bd8afaed0d704093" UNIQUE ("role"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'Pending', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "banReason" character varying, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Pending', "roleId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_role_enum"`);
    }

}
