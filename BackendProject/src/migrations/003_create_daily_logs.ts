import { Pool } from "pg";

export async function up(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS daily_logs (
                id SERIAL PRIMARY KEY,
                habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                log_date DATE NOT NULL,
                completed BOOLEAN DEFAULT true,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(habit_id, log_date)
            );
            
            CREATE INDEX idx_daily_logs_habit_id ON daily_logs(habit_id);
            CREATE INDEX idx_daily_logs_log_date ON daily_logs(log_date);
        `);
        console.log("✅ Migration 003: daily_logs table created");
    } finally {
        client.release();
    }
}

export async function down(pool: Pool): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`DROP TABLE IF EXISTS daily_logs;`);
        console.log("✅ Migration 003: daily_logs table dropped");
    } finally {
        client.release();
    }
}
