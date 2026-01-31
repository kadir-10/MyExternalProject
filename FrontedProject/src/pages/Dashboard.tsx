import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HabitList from "@/components/HabitList";
import AddHabitDialog from "@/components/AddHabitDialog";
import Sidebar from "@/components/Sidebar";
import { Plus, TrendingUp, Target, CheckCircle2, Flame } from "lucide-react";

interface User {
    id: number;
    username: string;
    email: string;
}

interface Habit {
    id: number;
    title: string;
    category?: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
        loadHabits();
    }, []);

    async function loadUser() {
        try {
            const res = await api.get("/protected");
            setUser(res.data.user);
        } catch (error) {
            navigate("/");
        }
    }

    async function loadHabits() {
        try {
            const res = await api.get("/habits");
            setHabits(res.data);
        } catch (error) {
            console.error("Failed to load habits:", error);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    function handleHabitAdded() {
        setIsAddDialogOpen(false);
        setEditingHabit(null);
        setRefreshKey(prev => prev + 1);
        loadHabits();
    }

    function handleEdit(habit: Habit) {
        setEditingHabit(habit);
        setIsAddDialogOpen(true);
    }

    function handleDialogClose(open: boolean) {
        setIsAddDialogOpen(open);
        if (!open) {
            setEditingHabit(null);
        }
    }

    const stats = [
        {
            title: "Toplam Alışkanlık",
            value: habits.length.toString(),
            description: "Takip ettiğiniz alışkanlıklar",
            icon: Target,
            trend: "+2 bu hafta"
        },
        {
            title: "Aktif Streak",
            value: "7",
            description: "Gün üst üste",
            icon: Flame,
            trend: "Harika gidiyorsun!"
        },
        {
            title: "Tamamlanan",
            value: "12",
            description: "Bu hafta",
            icon: CheckCircle2,
            trend: "+20% geçen haftadan"
        },
        {
            title: "Başarı Oranı",
            value: "85%",
            description: "Son 30 gün",
            icon: TrendingUp,
            trend: "+5% artış"
        }
    ];

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar user={user} onLogout={handleLogout} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="border-b bg-background">
                    <div className="flex h-16 items-center justify-between px-6">
                        <h1 className="text-2xl font-bold">Ana Sayfa</h1>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Alışkanlık
                        </Button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Hoşgeldin, {user?.username || "..."}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Bugünkü hedeflerine ulaşmak için harika bir gün!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                        <Badge variant="secondary" className="mt-2">
                                            {stat.trend}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Habits List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alışkanlıklarım</CardTitle>
                            <CardDescription>
                                Hedeflerinizi takip edin ve başarılarınızı ölçün
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HabitList key={refreshKey} onEdit={handleEdit} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            </div>

            <AddHabitDialog
                open={isAddDialogOpen}
                onOpenChange={handleDialogClose}
                onHabitAdded={handleHabitAdded}
                editHabit={editingHabit}
            />
        </div>
    );
}
