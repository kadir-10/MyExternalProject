import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import * as habitController from "../controllers/habitController";

const router = Router();

router.get("/", authMiddleware, habitController.getHabits);
router.get("/:id", authMiddleware, habitController.getHabit);
router.post("/", authMiddleware, habitController.createHabit);
router.put("/:id", authMiddleware, habitController.updateHabit);
router.delete("/:id", authMiddleware, habitController.deleteHabit);

export default router;
