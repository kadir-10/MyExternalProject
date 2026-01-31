import pool from "../db";
import { Habit, CreateHabitDTO, UpdateHabitDTO } from "../models/Habit";

export class HabitService {
    async getUserHabits(userId: number): Promise<Habit[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC",
                [userId]
            );
            return result.rows;
        } finally {
            client.release();
        }
    }

    async getHabitById(habitId: number, userId: number): Promise<Habit | null> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
                [habitId, userId]
            );
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async createHabit(userId: number, data: CreateHabitDTO): Promise<Habit> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO habits (user_id, title, description, category, frequency)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, data.title, data.description, data.category, data.frequency || 'daily']
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async updateHabit(habitId: number, userId: number, data: UpdateHabitDTO): Promise<Habit | null> {
        const client = await pool.connect();
        try {
            const updates: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (data.title !== undefined) {
                updates.push(`title = $${paramCount++}`);
                values.push(data.title);
            }
            if (data.description !== undefined) {
                updates.push(`description = $${paramCount++}`);
                values.push(data.description);
            }
            if (data.category !== undefined) {
                updates.push(`category = $${paramCount++}`);
                values.push(data.category);
            }
            if (data.frequency !== undefined) {
                updates.push(`frequency = $${paramCount++}`);
                values.push(data.frequency);
            }
            if (data.is_active !== undefined) {
                updates.push(`is_active = $${paramCount++}`);
                values.push(data.is_active);
            }

            updates.push(`updated_at = CURRENT_TIMESTAMP`);

            if (updates.length === 1) {
                return this.getHabitById(habitId, userId);
            }

            values.push(habitId, userId);

            const result = await client.query(
                `UPDATE habits SET ${updates.join(', ')}
                 WHERE id = $${paramCount++} AND user_id = $${paramCount++}
                 RETURNING *`,
                values
            );

            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async deleteHabit(habitId: number, userId: number): Promise<boolean> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                "DELETE FROM habits WHERE id = $1 AND user_id = $2",
                [habitId, userId]
            );
            return result.rowCount !== null && result.rowCount > 0;
        } finally {
            client.release();
        }
    }
}
