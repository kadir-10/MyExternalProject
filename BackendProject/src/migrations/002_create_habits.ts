import { Pool } from "pg";

export async function up(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS habits (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES application_users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                frequency VARCHAR(50) DEFAULT 'daily',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX idx_habits_user_id ON habits(user_id);
            CREATE INDEX idx_habits_is_active ON habits(is_active);
        `);
        console.log("✅ Migration 002: habits table created");
    } finally {
        client.release();
    }
}

export async function down(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`DROP TABLE IF EXISTS habits;`);
        console.log("✅ Migration 002: habits table dropped");
    } finally {
        client.release();
    }
}
