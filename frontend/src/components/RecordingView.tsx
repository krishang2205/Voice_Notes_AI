import React from 'react';
import { Square, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface RecordingViewProps {
    duration: number;
    onStop: () => void;
    onCancel: () => void;
}

export const RecordingView = ({ duration, onStop, onCancel }: RecordingViewProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-64 gap-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative">
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <div className="relative h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500">
                    <span className="text-3xl font-mono font-bold text-red-500">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            <div className="text-muted-foreground text-sm font-medium">
                Recording in progress...
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onCancel}
                    className="p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    title="Cancel"
                >
                    <X className="h-6 w-6" />
                </button>

                <button
                    onClick={onStop}
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                    title="Stop Recording"
                >
                    <Square className="h-6 w-6 text-white fill-current" />
                </button>
            </div>
        </div>
    );
};
