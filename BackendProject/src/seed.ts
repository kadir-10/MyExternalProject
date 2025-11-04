import pool from "./db";
import bcrypt from "bcrypt";
import { runMigrations } from "./migrations";

async function seed() {
    try {
        console.log("🔄 Running migrations...");
        await runMigrations(pool);

        const client = await pool.connect();
        try {
            const testUsers = [
                { username: "testuser", email: "test@example.com", password: "Password123!" },
                { username: "devuser", email: "dev@example.com", password: "Dev123!" },
            ];

            for (const user of testUsers) {
                const hash = await bcrypt.hash(user.password, 10);
                const res = await client.query(
                    "SELECT id FROM application_users WHERE username = $1",
                    [user.username]
                );

                if (res.rowCount === 0) {
                    await client.query(
                        "INSERT INTO application_users (username, email, password_hash) VALUES ($1, $2, $3)",
                        [user.username, user.email, hash]
                    );
                    console.log(`✅ Created user: ${user.username} / ${user.password}`);
                } else {
                    console.log(`ℹ️  User already exists: ${user.username}`);
                }
            }

            console.log("✅ Seed completed successfully");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
