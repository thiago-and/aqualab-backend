import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767209477619 implements MigrationInterface {
    name = 'InitialSchema1767209477619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_90860a5043712e75bad9deefcb3" UNIQUE ("enrollment_number"), CONSTRAINT "UQ_7568c49a630907119e4a665c605" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"), CONSTRAINT "FK_312ef40fcde70b8c55ea421bc99" FOREIGN KEY ("yearId") REFERENCES "years" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d273fbce9b7860e40111a44870d" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_students"("id", "name", "enrollment_number", "yearId", "teacherId") SELECT "id", "name", "enrollment_number", "yearId", "teacherId" FROM "students"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`ALTER TABLE "temporary_students" RENAME TO "students"`);
        await queryRunner.query(`CREATE TABLE "temporary_years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar, CONSTRAINT "FK_193c774f4162b8483b79ed9096e" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_years"("id", "year", "teacherId") SELECT "id", "year", "teacherId" FROM "years"`);
        await queryRunner.query(`DROP TABLE "years"`);
        await queryRunner.query(`ALTER TABLE "temporary_years" RENAME TO "years"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "years" RENAME TO "temporary_years"`);
        await queryRunner.query(`CREATE TABLE "years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar)`);
        await queryRunner.query(`INSERT INTO "years"("id", "year", "teacherId") SELECT "id", "year", "teacherId" FROM "temporary_years"`);
        await queryRunner.query(`DROP TABLE "temporary_years"`);
        await queryRunner.query(`ALTER TABLE "students" RENAME TO "temporary_students"`);
        await queryRunner.query(`CREATE TABLE "students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"))`);
        await queryRunner.query(`INSERT INTO "students"("id", "name", "enrollment_number", "yearId", "teacherId") SELECT "id", "name", "enrollment_number", "yearId", "teacherId" FROM "temporary_students"`);
        await queryRunner.query(`DROP TABLE "temporary_students"`);
        await queryRunner.query(`DROP TABLE "years"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
