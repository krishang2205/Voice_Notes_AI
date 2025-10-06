import React, { useState } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

// Add type definition for window.electron
declare global {
    interface Window {
        electron?: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
    }
}

export const TitleBar = () => {
    const isElectron = typeof window !== 'undefined' && !!window.electron;

    if (!isElectron) return null;

    return (
        <div className="h-8 bg-background border-b flex items-center justify-between select-none app-region-drag sticky top-0 z-50">
            <div className="px-4 text-xs font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                Voice Notes AI
            </div>

            <div className="flex h-full app-region-no-drag">
                <button
                    onClick={() => window.electron?.minimize()}
                    className="px-4 hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <button
                    onClick={() => window.electron?.maximize()}
                    className="px-4 hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                    <Square className="h-3 w-3" />
                </button>
                <button
                    onClick={() => window.electron?.close()}
                    className="px-4 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
