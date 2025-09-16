import React from 'react';
import { Mic, List, CheckSquare, Settings } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
            isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/10 flex flex-col p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Mic className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg">Voice Notes AI</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <NavItem
                        to="/"
                        icon={<Mic className="h-4 w-4" />}
                        label="Record"
                        isActive={location.pathname === '/'}
                    />
                    <NavItem
                        to="/transcripts"
                        icon={<List className="h-4 w-4" />}
                        label="Transcripts"
                        isActive={location.pathname === '/transcripts'}
                    />
                    <NavItem
                        to="/tasks"
                        icon={<CheckSquare className="h-4 w-4" />}
                        label="Action Items"
                        isActive={location.pathname === '/tasks'}
                    />
                </nav>

                <div className="mt-auto pt-4 border-t">
                    <NavItem
                        to="/settings"
                        icon={<Settings className="h-4 w-4" />}
                        label="Settings"
                        isActive={location.pathname === '/settings'}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
