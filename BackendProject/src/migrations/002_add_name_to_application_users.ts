import { Pool } from "pg";

export async function up(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE application_users 
            ADD COLUMN name VARCHAR(255);
        `);
        console.log("✅ Migration 002: name column added to application_users");
    } finally {
        client.release();
    }
}

export async function down(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE application_users 
            DROP COLUMN IF EXISTS name;
        `);
        console.log("✅ Migration 002: name column removed from application_users");
    } finally {
        client.release();
    }
}
