import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface TranscriptionViewerProps {
    text: string;
    className?: string;
}

export const TranscriptionViewer = ({ text, className }: TranscriptionViewerProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Transcription</h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                    title="Copy text"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>

            <div className="p-4 rounded-lg border bg-muted/5 text-sm leading-relaxed whitespace-pre-wrap">
                {text}
            </div>
        </div>
    );
};
