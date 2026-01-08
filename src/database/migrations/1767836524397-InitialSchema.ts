import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767836524397 implements MigrationInterface {
    name = 'InitialSchema1767836524397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL DEFAULT (0), "questionId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_90860a5043712e75bad9deefcb3" UNIQUE ("enrollment_number"), CONSTRAINT "UQ_7568c49a630907119e4a665c605" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL DEFAULT (0), "questionId" varchar NOT NULL, CONSTRAINT "FK_912dd301518a846947070f73a31" FOREIGN KEY ("questionId") REFERENCES "quiz_questions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_options"("id", "text", "is_correct", "questionId") SELECT "id", "text", "is_correct", "questionId" FROM "quiz_options"`);
        await queryRunner.query(`DROP TABLE "quiz_options"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_options" RENAME TO "quiz_options"`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL, CONSTRAINT "FK_8889ccc5a40989ea308a588870e" FOREIGN KEY ("quizId") REFERENCES "quiz_quizzes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_questions"("id", "statement", "quizId") SELECT "id", "statement", "quizId" FROM "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_questions" RENAME TO "quiz_questions"`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL, CONSTRAINT "FK_b2d46806dfc523c8f667a884481" FOREIGN KEY ("yearId") REFERENCES "years" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e12094c8d304da87bd12d0a8aca" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_quizzes"("id", "title", "createdAt", "yearId", "teacherId") SELECT "id", "title", "createdAt", "yearId", "teacherId" FROM "quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "quiz_quizzes"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_quizzes" RENAME TO "quiz_quizzes"`);
        await queryRunner.query(`CREATE TABLE "temporary_years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar NOT NULL, CONSTRAINT "FK_193c774f4162b8483b79ed9096e" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_years"("id", "year", "teacherId") SELECT "id", "year", "teacherId" FROM "years"`);
        await queryRunner.query(`DROP TABLE "years"`);
        await queryRunner.query(`ALTER TABLE "temporary_years" RENAME TO "years"`);
        await queryRunner.query(`CREATE TABLE "temporary_students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"), CONSTRAINT "FK_312ef40fcde70b8c55ea421bc99" FOREIGN KEY ("yearId") REFERENCES "years" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d273fbce9b7860e40111a44870d" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_students"("id", "name", "enrollment_number", "yearId", "teacherId") SELECT "id", "name", "enrollment_number", "yearId", "teacherId" FROM "students"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`ALTER TABLE "temporary_students" RENAME TO "students"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" RENAME TO "temporary_students"`);
        await queryRunner.query(`CREATE TABLE "students" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "enrollment_number" integer NOT NULL, "yearId" varchar NOT NULL, "teacherId" varchar, CONSTRAINT "UQ_bdae944fe70952b25d3b4d8234c" UNIQUE ("enrollment_number"))`);
        await queryRunner.query(`INSERT INTO "students"("id", "name", "enrollment_number", "yearId", "teacherId") SELECT "id", "name", "enrollment_number", "yearId", "teacherId" FROM "temporary_students"`);
        await queryRunner.query(`DROP TABLE "temporary_students"`);
        await queryRunner.query(`ALTER TABLE "years" RENAME TO "temporary_years"`);
        await queryRunner.query(`CREATE TABLE "years" ("id" varchar PRIMARY KEY NOT NULL, "year" integer NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "years"("id", "year", "teacherId") SELECT "id", "year", "teacherId" FROM "temporary_years"`);
        await queryRunner.query(`DROP TABLE "temporary_years"`);
        await queryRunner.query(`ALTER TABLE "quiz_quizzes" RENAME TO "temporary_quiz_quizzes"`);
        await queryRunner.query(`CREATE TABLE "quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_quizzes"("id", "title", "createdAt", "yearId", "teacherId") SELECT "id", "title", "createdAt", "yearId", "teacherId" FROM "temporary_quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_quizzes"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME TO "temporary_quiz_questions"`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_questions"("id", "statement", "quizId") SELECT "id", "statement", "quizId" FROM "temporary_quiz_questions"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_questions"`);
        await queryRunner.query(`ALTER TABLE "quiz_options" RENAME TO "temporary_quiz_options"`);
        await queryRunner.query(`CREATE TABLE "quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL DEFAULT (0), "questionId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_options"("id", "text", "is_correct", "questionId") SELECT "id", "text", "is_correct", "questionId" FROM "temporary_quiz_options"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_options"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "years"`);
        await queryRunner.query(`DROP TABLE "quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "quiz_options"`);
    }

}
