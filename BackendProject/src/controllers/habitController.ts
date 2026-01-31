import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { HabitService } from "../services/habitService";
import { CreateHabitDTO, UpdateHabitDTO } from "../models/Habit";

const habitService = new HabitService();

export async function getHabits(req: AuthRequest, res: Response) {
    try {
        const habits = await habitService.getUserHabits(req.userId!);
        return res.json(habits);
    } catch (error) {
        console.error("Get habits error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function getHabit(req: AuthRequest, res: Response) {
    try {
        const habitId = parseInt(req.params.id);
        const habit = await habitService.getHabitById(habitId, req.userId!);
        
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        return res.json(habit);
    } catch (error) {
        console.error("Get habit error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function createHabit(req: AuthRequest, res: Response) {
    try {
        const data: CreateHabitDTO = req.body;
        
        if (!data.title) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const habit = await habitService.createHabit(req.userId!, data);
        return res.status(201).json(habit);
    } catch (error) {
        console.error("Create habit error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function updateHabit(req: AuthRequest, res: Response) {
    try {
        const habitId = parseInt(req.params.id);
        const data: UpdateHabitDTO = req.body;
        
        const habit = await habitService.updateHabit(habitId, req.userId!, data);
        
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        return res.json(habit);
    } catch (error) {
        console.error("Update habit error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function deleteHabit(req: AuthRequest, res: Response) {
    try {
        const habitId = parseInt(req.params.id);
        const deleted = await habitService.deleteHabit(habitId, req.userId!);
        
        if (!deleted) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        return res.status(204).send();
    } catch (error) {
        console.error("Delete habit error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
