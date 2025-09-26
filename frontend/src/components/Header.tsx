import React from 'react';
import { Menu, Mic } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    return (
        <header className="h-14 border-b flex items-center px-4 gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 md:hidden">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                    <Mic className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">Voice Notes AI</span>
            </div>
        </header>
    );
};
