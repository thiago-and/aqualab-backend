import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizAttemptDetails1769000000000 implements MigrationInterface {
    name = 'AddQuizAttemptDetails1769000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`quizTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`totalPoints\` int NOT NULL DEFAULT 100`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`totalQuestions\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`correctAnswers\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`incorrectAnswers\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`percentage\` float NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`answers\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`submittedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_quiz_attempt_unique_student_quiz\` ON \`quiz_attempts\` (\`studentId\`, \`quizId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quiz_attempt_student\` ON \`quiz_attempts\` (\`studentId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quiz_attempt_quiz\` ON \`quiz_attempts\` (\`quizId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quiz_attempt_submitted\` ON \`quiz_attempts\` (\`submittedAt\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_quiz_attempt_submitted\` ON \`quiz_attempts\``);
        await queryRunner.query(`DROP INDEX \`IDX_quiz_attempt_quiz\` ON \`quiz_attempts\``);
        await queryRunner.query(`DROP INDEX \`IDX_quiz_attempt_student\` ON \`quiz_attempts\``);
        await queryRunner.query(`DROP INDEX \`IDX_quiz_attempt_unique_student_quiz\` ON \`quiz_attempts\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`submittedAt\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`answers\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`percentage\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`incorrectAnswers\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`correctAnswers\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`totalQuestions\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`totalPoints\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP COLUMN \`quizTitle\``);
    }

}
