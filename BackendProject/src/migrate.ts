import pool from "./db";
import { runMigrations, rollbackLastMigration } from "./migrations";

const command = process.argv[2];

async function main() {
    try {
        if (command === "up") {
            await runMigrations(pool);
        } else if (command === "down") {
            await rollbackLastMigration(pool);
        } else {
            console.log("Usage:");
            console.log("  npm run migrate up    - Run pending migrations");
            console.log("  npm run migrate down  - Rollback last migration");
        }
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
