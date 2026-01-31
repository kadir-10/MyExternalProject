export interface Habit {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    category?: string;
    frequency: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateHabitDTO {
    title: string;
    description?: string;
    category?: string;
    frequency?: string;
}

export interface UpdateHabitDTO {
    title?: string;
    description?: string;
    category?: string;
    frequency?: string;
    is_active?: boolean;
}
