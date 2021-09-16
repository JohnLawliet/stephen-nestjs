import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

// NOTE: (in jest-e2e.json)setupFilesAfterEnv = executes just before any test is executed
// "setupFilesAfterEnv": ["<rootDir>/setup.ts"] -> rootDir refers to the root directory or test directory

// What this code needs to do:
// 1. if test.sqlite exists, delete it before every test run
// 2. after deleting, inform typeorm to disconnect from the test.sqlite db coz typeorm isn't concerned about functioning of rm on the db in filesystem
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
