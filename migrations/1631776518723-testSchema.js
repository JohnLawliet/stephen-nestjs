const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class testSchema1631776518723 {
    name = 'testSchema1631776518723'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "Reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_Reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer, CONSTRAINT "FK_91f67fa088acf2236c833f0a8f8" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Reports"("id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId" FROM "Reports"`);
        await queryRunner.query(`DROP TABLE "Reports"`);
        await queryRunner.query(`ALTER TABLE "temporary_Reports" RENAME TO "Reports"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "Reports" RENAME TO "temporary_Reports"`);
        await queryRunner.query(`CREATE TABLE "Reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "Reports"("id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId" FROM "temporary_Reports"`);
        await queryRunner.query(`DROP TABLE "temporary_Reports"`);
        await queryRunner.query(`DROP TABLE "Reports"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }
}
