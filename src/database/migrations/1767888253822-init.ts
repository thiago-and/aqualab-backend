import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767888253822 implements MigrationInterface {
    name = 'Init1767888253822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`quiz_options\` (\`id\` varchar(36) NOT NULL, \`text\` varchar(255) NOT NULL, \`is_correct\` tinyint NOT NULL DEFAULT 0, \`questionId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_questions\` (\`id\` varchar(36) NOT NULL, \`statement\` varchar(255) NOT NULL, \`quizId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_student_answers\` (\`id\` varchar(36) NOT NULL, \`attemptId\` varchar(36) NOT NULL, \`questionId\` varchar(36) NOT NULL, \`selectedOptionId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_attempts\` (\`id\` varchar(36) NOT NULL, \`status\` enum ('IN_PROGRESS', 'FINISHED') NOT NULL DEFAULT 'IN_PROGRESS', \`score\` float NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` varchar(36) NOT NULL, \`quizId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_quizzes\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`yearId\` varchar(36) NOT NULL, \`teacherId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`years\` (\`id\` varchar(36) NOT NULL, \`year\` int NOT NULL, \`teacherId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`enrollment_number\` int NOT NULL, \`yearId\` varchar(36) NOT NULL, \`teacherId\` varchar(36) NULL, UNIQUE INDEX \`IDX_bdae944fe70952b25d3b4d8234\` (\`enrollment_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`enrollment_number\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_90860a5043712e75bad9deefcb\` (\`enrollment_number\`), UNIQUE INDEX \`IDX_7568c49a630907119e4a665c60\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`quiz_options\` ADD CONSTRAINT \`FK_912dd301518a846947070f73a31\` FOREIGN KEY (\`questionId\`) REFERENCES \`quiz_questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_8889ccc5a40989ea308a588870e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz_quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` ADD CONSTRAINT \`FK_bf0812efaa72661153424e56377\` FOREIGN KEY (\`attemptId\`) REFERENCES \`quiz_attempts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` ADD CONSTRAINT \`FK_30d94ae9187ad0d14b83177bfcf\` FOREIGN KEY (\`questionId\`) REFERENCES \`quiz_questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` ADD CONSTRAINT \`FK_e5d84ec47b1b384229387616bcf\` FOREIGN KEY (\`selectedOptionId\`) REFERENCES \`quiz_options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_30ae16bcedd2b2663686edfc7a8\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_23f2bbe9288b221b1b377372782\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz_quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_quizzes\` ADD CONSTRAINT \`FK_b2d46806dfc523c8f667a884481\` FOREIGN KEY (\`yearId\`) REFERENCES \`years\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_quizzes\` ADD CONSTRAINT \`FK_e12094c8d304da87bd12d0a8aca\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`years\` ADD CONSTRAINT \`FK_193c774f4162b8483b79ed9096e\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_312ef40fcde70b8c55ea421bc99\` FOREIGN KEY (\`yearId\`) REFERENCES \`years\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_d273fbce9b7860e40111a44870d\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_d273fbce9b7860e40111a44870d\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_312ef40fcde70b8c55ea421bc99\``);
        await queryRunner.query(`ALTER TABLE \`years\` DROP FOREIGN KEY \`FK_193c774f4162b8483b79ed9096e\``);
        await queryRunner.query(`ALTER TABLE \`quiz_quizzes\` DROP FOREIGN KEY \`FK_e12094c8d304da87bd12d0a8aca\``);
        await queryRunner.query(`ALTER TABLE \`quiz_quizzes\` DROP FOREIGN KEY \`FK_b2d46806dfc523c8f667a884481\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_23f2bbe9288b221b1b377372782\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_30ae16bcedd2b2663686edfc7a8\``);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` DROP FOREIGN KEY \`FK_e5d84ec47b1b384229387616bcf\``);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` DROP FOREIGN KEY \`FK_30d94ae9187ad0d14b83177bfcf\``);
        await queryRunner.query(`ALTER TABLE \`quiz_student_answers\` DROP FOREIGN KEY \`FK_bf0812efaa72661153424e56377\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_8889ccc5a40989ea308a588870e\``);
        await queryRunner.query(`ALTER TABLE \`quiz_options\` DROP FOREIGN KEY \`FK_912dd301518a846947070f73a31\``);
        await queryRunner.query(`DROP INDEX \`IDX_7568c49a630907119e4a665c60\` ON \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_90860a5043712e75bad9deefcb\` ON \`teachers\``);
        await queryRunner.query(`DROP TABLE \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_bdae944fe70952b25d3b4d8234\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
        await queryRunner.query(`DROP TABLE \`years\``);
        await queryRunner.query(`DROP TABLE \`quiz_quizzes\``);
        await queryRunner.query(`DROP TABLE \`quiz_attempts\``);
        await queryRunner.query(`DROP TABLE \`quiz_student_answers\``);
        await queryRunner.query(`DROP TABLE \`quiz_questions\``);
        await queryRunner.query(`DROP TABLE \`quiz_options\``);
    }

}
