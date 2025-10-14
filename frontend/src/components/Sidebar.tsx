import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mic, List, CheckSquare, Settings, CalendarClock } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
    <NavLink
        to={to}
        className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium relative group",
            isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        {({ isActive }) => (
            <>
                {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-md animate-in slide-in-from-left-1 duration-200" />
                )}
                <span className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")}>
                    {icon}
                </span>
                <span>{label}</span>
            </>
        )}
    </NavLink>
);

export const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 h-full p-4 gap-6">
            <div className="flex items-center gap-3 px-2 py-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none tracking-tight">Voice Notes</span>
                    <span className="text-xs text-muted-foreground font-medium">AI Assistant</span>
                </div>
            </div>

            <nav className="space-y-1.5 flex-1">
                <div className="px-2 pb-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                    Menu
                </div>
                <NavItem to="/" icon={<Mic className="h-4 w-4" />} label="Record" />
                <NavItem to="/history" icon={<CalendarClock className="h-4 w-4" />} label="History" />
                <NavItem to="/transcripts" icon={<List className="h-4 w-4" />} label="Transcripts" />
                <NavItem to="/tasks" icon={<CheckSquare className="h-4 w-4" />} label="Action Items" />
            </nav>

            <div className="mt-auto pt-4 border-t">
                <div className="px-2 pb-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                    Preferences
                </div>
                <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
            </div>

            <div className="text-xs text-muted-foreground text-center py-2 opacity-50">
                v1.0.0 Alpha
            </div>
        </aside>
    );
};
