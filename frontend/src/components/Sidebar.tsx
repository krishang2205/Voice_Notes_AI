import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mic, List, CheckSquare, Settings } from 'lucide-react';
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
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
            isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export const Sidebar = () => {
    return (
        <aside className="hidden md:flex w-64 border-r bg-muted/10 flex-col p-4 h-full">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Mic className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Voice Notes AI</span>
            </div>

            <nav className="space-y-1 flex-1">
                <NavItem to="/" icon={<Mic className="h-4 w-4" />} label="Record" />
                <NavItem to="/transcripts" icon={<List className="h-4 w-4" />} label="Transcripts" />
                <NavItem to="/tasks" icon={<CheckSquare className="h-4 w-4" />} label="Action Items" />
            </nav>

            <div className="mt-auto pt-4 border-t">
                <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
            </div>
        </aside>
    );
};
