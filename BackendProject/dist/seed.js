"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed() {
    const client = await db_1.default.connect();
    try {
        // create table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);
        // create test user
        const username = "testuser";
        const plain = "Password123!";
        const hash = await bcrypt_1.default.hash(plain, 10);
        const res = await client.query("SELECT id FROM users WHERE username = $1", [username]);
        if (res.rowCount === 0) {
            await client.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [username, hash]);
            console.log(`Inserted test user: ${username} / ${plain}`);
        }
        else {
            console.log("Test user already exists");
        }
    }
    catch (err) {
        console.error("Seed error:", err);
    }
    finally {
        client.release();
        process.exit(0);
    }
}
seed();
