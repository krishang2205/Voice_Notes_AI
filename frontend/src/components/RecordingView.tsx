import React from 'react';
import { Square, X, Pause, Play } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { cn } from '../lib/utils';

interface RecordingViewProps {
    duration: number;
    rawStream: MediaStream | null;
    isPaused?: boolean;
    onStop: () => void;
    onCancel: () => void;
    onPause?: () => void;
    onResume?: () => void;
}

export const RecordingView = ({
    duration,
    rawStream,
    isPaused = false,
    onStop,
    onCancel,
    onPause,
    onResume
}: RecordingViewProps) => {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-72 gap-6 w-full max-w-md mx-auto p-6 bg-card rounded-xl border border-border shadow-sm animate-in fade-in zoom-in-95 duration-300">

            {/* Visualizer Area */}
            <div className="relative w-full h-32 bg-secondary/30 rounded-lg overflow-hidden flex items-center justify-center">
                {rawStream ? (
                    <AudioVisualizer
                        stream={rawStream}
                        isRecording={!isPaused}
                        height={128}
                        width={400}
                        barColor={isPaused ? '#94a3b8' : '#3b82f6'}
                    />
                ) : (
                    <div className="flex space-x-1 items-center h-8">
                        {/* Fallback Animation */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-primary/50 rounded-full animate-pulse"
                                style={{ height: `${Math.random() * 24 + 8}px`, animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                )}

                {/* Timer Overlay */}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono font-medium border border-border/50">
                    {formatTime(duration)}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={onCancel}
                    className="p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                    title="Cancel Recording"
                >
                    <X className="h-5 w-5" />
                </button>

                {isPaused ? (
                    <button
                        onClick={onResume}
                        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                        title="Resume"
                    >
                        <Play className="h-6 w-6 text-primary-foreground ml-1" />
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="h-14 w-14 rounded-full bg-secondary hover:bg-secondary/80 border border-input transition-colors flex items-center justify-center shadow-sm hover:scale-105 active:scale-95"
                        title="Pause"
                    >
                        <Pause className="h-6 w-6 text-foreground" />
                    </button>
                )}

                <button
                    onClick={onStop}
                    className="h-14 w-14 rounded-full bg-destructive hover:bg-destructive/90 transition-colors flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                    title="Finish & Save"
                >
                    <Square className="h-5 w-5 text-destructive-foreground fill-current" />
                </button>
            </div>

            <p className="text-xs text-muted-foreground">
                {isPaused ? 'Recording paused' : 'Listening...'}
            </p>
        </div>
    );
};
