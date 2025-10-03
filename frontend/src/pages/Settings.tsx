import React, { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Settings() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        toast.success(`Theme set to ${newTheme} mode`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your interface preferences and application settings.
                </p>
            </div>

            <div className="border rounded-lg p-6 space-y-6 bg-card">
                <div>
                    <h3 className="text-lg font-medium">Appearance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Customize how Voice Notes AI looks on your device.
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={cn(
                                "flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground",
                                theme === 'light' ? "border-primary bg-accent" : "border-muted bg-transparent"
                            )}
                        >
                            <Sun className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Light</span>
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={cn(
                                "flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground",
                                theme === 'dark' ? "border-primary bg-accent" : "border-muted bg-transparent"
                            )}
                        >
                            <Moon className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Dark</span>
                        </button>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Irreversible actions for your account.
                    </p>
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                        onClick={() => toast.error("Not implemented yet!")}
                    >
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
}
