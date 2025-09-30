import React from 'react';
import { CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface ActionItemListProps {
    items: string[];
    className?: string;
}

export const ActionItemList = ({ items, className }: ActionItemListProps) => {
    if (!items || items.length === 0) return null;

    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        const next = new Set(checkedItems);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setCheckedItems(next);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 text-orange-500">
                <CheckSquare className="h-4 w-4" />
                <h3 className="text-sm font-medium">Action Items</h3>
            </div>

            <div className="bg-card rounded-lg border shadow-sm divide-y">
                {items.map((item, index) => {
                    const isChecked = checkedItems.has(index);
                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex gap-3 p-4 items-start transition-colors cursor-pointer hover:bg-muted/50",
                                isChecked && "bg-muted/30"
                            )}
                            onClick={() => toggleItem(index)}
                        >
                            <div className={cn(
                                "mt-1 h-4 w-4 rounded border border-primary/50 shrink-0 flex items-center justify-center transition-colors",
                                isChecked ? "bg-primary border-primary" : "bg-background"
                            )}>
                                {isChecked && <CheckSquare className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className={cn(
                                "text-sm leading-relaxed transition-all",
                                isChecked ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
                            )}>
                                {item}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
