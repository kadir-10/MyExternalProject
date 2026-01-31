import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
    Home, 
    Target, 
    BarChart3, 
    Settings, 
    HelpCircle, 
    Search,
    LogOut,
    MoreVertical,
    User,
    CreditCard,
    Bell,
    Moon,
    Sun,
    Languages
} from "lucide-react";

interface SidebarProps {
    user: {
        username: string;
        email: string;
    } | null;
    onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const menuItems = [
        { icon: Home, label: t("dashboard"), active: true },
        { icon: Target, label: t("myHabits"), active: false },
        { icon: BarChart3, label: t("statistics"), active: false },
    ];

    const bottomMenuItems = [
        { icon: HelpCircle, label: t("help") },
        { icon: Search, label: t("search") },
    ];

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-background">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Target className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold">Alışkanlık</span>
            </div>

            {/* Main Menu */}
            <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.label}
                                variant={item.active ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="border-t p-4">
                {/* Settings Dropdown */}
                <div className="space-y-1 mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                size="sm"
                            >
                                <Settings className="mr-3 h-4 w-4" />
                                {t("settings")}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" side="right">
                            <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Theme */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    {theme === "dark" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                                    {t("theme")}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                                        <DropdownMenuRadioItem value="light">
                                            <Sun className="mr-2 h-4 w-4" />
                                            {t("light")}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">
                                            <Moon className="mr-2 h-4 w-4" />
                                            {t("dark")}
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Language */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Languages className="mr-2 h-4 w-4" />
                                    {t("language")}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as "tr" | "en")}>
                                        <DropdownMenuRadioItem value="tr">
                                            🇹🇷 Türkçe
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="en">
                                            🇬🇧 English
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.label}
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                size="sm"
                            >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        );
                    })}
                </div>

                {/* User Profile with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg bg-muted p-3 hover:bg-muted/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                        {user?.username?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">
                                        {user?.username || "Kullanıcı"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {user?.email || "email@example.com"}
                                    </span>
                                </div>
                            </div>
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" side="right">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.username}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            {t("account")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {t("billing")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            {t("notifications")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            {t("logout")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
