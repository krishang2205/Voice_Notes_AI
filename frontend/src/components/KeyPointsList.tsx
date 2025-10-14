import React from 'react';
import { Sparkles, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

interface KeyPointsListProps {
    points: string[];
    className?: string;
}

export const KeyPointsList = ({ points, className }: KeyPointsListProps) => {
    if (!points || points.length === 0) return null;

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-sm font-medium">Key Points</h3>
            </div>

            <div className="bg-card rounded-lg border p-4 shadow-sm">
                <ul className="space-y-3">
                    {points.map((point, index) => (
                        <li key={index} className="flex gap-3 text-sm leading-relaxed text-foreground/80 group">
                            <Circle className="h-2 w-2 mt-2 fill-primary/40 text-primary shrink-0 group-hover:fill-primary transition-colors" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
