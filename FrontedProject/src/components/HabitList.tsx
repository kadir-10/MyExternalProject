import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit2 } from "lucide-react";

interface Habit {
    id: number;
    title: string;
    description?: string;
    category?: string;
    frequency: string;
    is_active: boolean;
}

interface HabitListProps {
    onEdit: (habit: Habit) => void;
}

export default function HabitList({ onEdit }: HabitListProps) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

    useEffect(() => {
        loadHabits();
    }, []);

    async function loadHabits() {
        try {
            const res = await api.get("/habits");
            setHabits(res.data);
        } catch (error) {
            console.error("Failed to load habits:", error);
        } finally {
            setLoading(false);
        }
    }

    function openDeleteDialog(habit: Habit) {
        setHabitToDelete(habit);
        setDeleteDialogOpen(true);
    }

    async function confirmDelete() {
        if (!habitToDelete) return;

        try {
            await api.delete(`/habits/${habitToDelete.id}`);
            setHabits(habits.filter(h => h.id !== habitToDelete.id));
            setDeleteDialogOpen(false);
            setHabitToDelete(null);
        } catch (error) {
            console.error("Failed to delete habit:", error);
            alert("Silme işlemi başarısız oldu");
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
    }

    if (habits.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">Henüz alışkanlık eklemediniz</p>
                <p className="text-sm text-muted-foreground">
                    "Yeni Alışkanlık" butonuna tıklayarak başlayın
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                        <div className="flex-1">
                            <h3 className="font-medium">{habit.title}</h3>
                            {habit.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {habit.description}
                                </p>
                            )}
                            <div className="flex gap-2 mt-2">
                                {habit.category && (
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                        {habit.category}
                                    </span>
                                )}
                                <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                                    {habit.frequency}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => onEdit(habit)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openDeleteDialog(habit)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Alışkanlığı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>{habitToDelete?.title}</strong> isimli alışkanlığı silmek istediğinize emin misiniz? 
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hayır</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Evet, Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
