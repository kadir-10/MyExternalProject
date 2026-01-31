export interface DailyLog {
    id: number;
    habit_id: number;
    log_date: Date;
    completed: boolean;
    notes?: string;
    created_at: Date;
}

export interface CreateDailyLogDTO {
    habit_id: number;
    log_date: string;
    completed?: boolean;
    notes?: string;
}
