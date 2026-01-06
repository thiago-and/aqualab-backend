import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizEntity1767654413560 implements MigrationInterface {
    name = 'AddQuizEntity1767654413560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL, "questionId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL, "questionId" varchar NOT NULL, CONSTRAINT "FK_912dd301518a846947070f73a31" FOREIGN KEY ("questionId") REFERENCES "quiz_questions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_options"("id", "text", "is_correct", "questionId") SELECT "id", "text", "is_correct", "questionId" FROM "quiz_options"`);
        await queryRunner.query(`DROP TABLE "quiz_options"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_options" RENAME TO "quiz_options"`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL, CONSTRAINT "FK_8889ccc5a40989ea308a588870e" FOREIGN KEY ("quizId") REFERENCES "quiz_quizzes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_questions"("id", "statement", "quizId") SELECT "id", "statement", "quizId" FROM "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_questions" RENAME TO "quiz_questions"`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL, CONSTRAINT "FK_b2d46806dfc523c8f667a884481" FOREIGN KEY ("yearId") REFERENCES "years" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e12094c8d304da87bd12d0a8aca" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz_quizzes"("id", "title", "createdAt", "yearId", "teacherId") SELECT "id", "title", "createdAt", "yearId", "teacherId" FROM "quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "quiz_quizzes"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz_quizzes" RENAME TO "quiz_quizzes"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_quizzes" RENAME TO "temporary_quiz_quizzes"`);
        await queryRunner.query(`CREATE TABLE "quiz_quizzes" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "yearId" varchar NOT NULL, "teacherId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_quizzes"("id", "title", "createdAt", "yearId", "teacherId") SELECT "id", "title", "createdAt", "yearId", "teacherId" FROM "temporary_quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_quizzes"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME TO "temporary_quiz_questions"`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" varchar PRIMARY KEY NOT NULL, "statement" varchar NOT NULL, "quizId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_questions"("id", "statement", "quizId") SELECT "id", "statement", "quizId" FROM "temporary_quiz_questions"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_questions"`);
        await queryRunner.query(`ALTER TABLE "quiz_options" RENAME TO "temporary_quiz_options"`);
        await queryRunner.query(`CREATE TABLE "quiz_options" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "is_correct" boolean NOT NULL, "questionId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "quiz_options"("id", "text", "is_correct", "questionId") SELECT "id", "text", "is_correct", "questionId" FROM "temporary_quiz_options"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz_options"`);
        await queryRunner.query(`DROP TABLE "quiz_quizzes"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "quiz_options"`);
    }

}
