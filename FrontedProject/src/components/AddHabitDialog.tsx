import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Habit {
    id: number;
    title: string;
    description?: string;
    category?: string;
    frequency: string;
}

interface AddHabitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onHabitAdded: () => void;
    editHabit?: Habit | null;
}

export default function AddHabitDialog({ open, onOpenChange, onHabitAdded, editHabit }: AddHabitDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editHabit) {
            setTitle(editHabit.title);
            setDescription(editHabit.description || "");
            setCategory(editHabit.category || "");
            setFrequency(editHabit.frequency || "daily");
        } else {
            setTitle("");
            setDescription("");
            setCategory("");
            setFrequency("daily");
        }
    }, [editHabit, open]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!title.trim()) {
            alert("Başlık zorunludur");
            return;
        }

        setLoading(true);

        try {
            if (editHabit) {
                await api.put(`/habits/${editHabit.id}`, {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    category: category.trim() || undefined,
                    frequency,
                });
            } else {
                await api.post("/habits", {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    category: category.trim() || undefined,
                    frequency,
                });
            }

            setTitle("");
            setDescription("");
            setCategory("");
            setFrequency("daily");
            onHabitAdded();
        } catch (error) {
            console.error(editHabit ? "Failed to update habit:" : "Failed to create habit:", error);
            alert(editHabit ? "Alışkanlık güncellenemedi" : "Alışkanlık eklenemedi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{editHabit ? "Alışkanlığı Düzenle" : "Yeni Alışkanlık"}</DialogTitle>
                        <DialogDescription>
                            {editHabit 
                                ? "Alışkanlık bilgilerini güncelleyin" 
                                : "Takip etmek istediğiniz yeni bir alışkanlık ekleyin"
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Başlık *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: Spor yap"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="İsteğe bağlı açıklama"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Örn: Sağlık"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="frequency">Sıklık</Label>
                            <select
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="daily">Günlük</option>
                                <option value="weekly">Haftalık</option>
                                <option value="monthly">Aylık</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading 
                                ? (editHabit ? "Güncelleniyor..." : "Ekleniyor...") 
                                : (editHabit ? "Güncelle" : "Ekle")
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
