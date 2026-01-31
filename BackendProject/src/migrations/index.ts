import { Pool } from "pg";
import * as migration001 from "./001_create_application_users";
import * as migration002 from "./002_add_name_to_application_users";
import * as migration003 from "./002_create_habits";
import * as migration004 from "./003_create_daily_logs";

interface Migration {
    id: number;
    name: string;
    up: (pool: Pool) => Promise<void>;
    down: (pool: Pool) => Promise<void>;
}

const migrations: Migration[] = [
    {
        id: 1,
        name: "001_create_application_users",
        up: migration001.up,
        down: migration001.down,
    },
    {
        id: 2,
        name: "002_add_name_to_application_users",
        up: migration002.up,
        down: migration002.down,
    },
    {
        id: 3,
        name: "002_create_habits",
        up: migration003.up,
        down: migration003.down,
    },
    {
        id: 4,
        name: "003_create_daily_logs",
        up: migration004.up,
        down: migration004.down,
    },
];

export async function runMigrations(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const result = await client.query("SELECT id FROM migrations ORDER BY id DESC LIMIT 1");
        const lastMigrationId = result.rows[0]?.id || 0;

        const pendingMigrations = migrations.filter(m => m.id > lastMigrationId);

        if (pendingMigrations.length === 0) {
            console.log("✅ No pending migrations");
            return;
        }

        console.log(`🔄 Running ${pendingMigrations.length} migration(s)...`);

        for (const migration of pendingMigrations) {
            await migration.up(pool);
            await client.query(
                "INSERT INTO migrations (id, name) VALUES ($1, $2)",
                [migration.id, migration.name]
            );
            console.log(`✅ Migration ${migration.id}: ${migration.name} completed`);
        }

        console.log("✅ All migrations completed successfully");
    } finally {
        client.release();
    }
}

export async function rollbackLastMigration(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT id, name FROM migrations ORDER BY id DESC LIMIT 1");
        
        if (result.rows.length === 0) {
            console.log("❌ No migrations to rollback");
            return;
        }

        const lastMigration = result.rows[0];
        const migration = migrations.find(m => m.id === lastMigration.id);

        if (!migration) {
            console.log(`❌ Migration ${lastMigration.id} not found`);
            return;
        }

        await migration.down(pool);
        await client.query("DELETE FROM migrations WHERE id = $1", [lastMigration.id]);
        console.log(`✅ Rolled back migration ${migration.id}: ${migration.name}`);
    } finally {
        client.release();
    }
}
