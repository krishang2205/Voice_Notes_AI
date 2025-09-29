import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProcessingSkeleton = () => {
    return (
        <div className="w-full max-w-md mx-auto space-y-8 py-12 animate-in fade-in duration-500">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">Processing your note...</h3>
                    <p className="text-sm text-muted-foreground">
                        Transcribing audio and generating summary
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-24 w-full bg-muted/50 animate-pulse rounded-lg" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="space-y-2">
                        <div className="h-10 w-full bg-muted/50 animate-pulse rounded-md" />
                        <div className="h-10 w-full bg-muted/50 animate-pulse rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};
