import React from 'react';
import { FileText, Calendar, Trash2 } from 'lucide-react';
import { VoiceNote } from '../context/VoiceNotesContext';

interface NoteCardProps {
    note: VoiceNote;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const NoteCard = ({ note, onClick, onDelete }: NoteCardProps) => {
    const date = new Date(note.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <div
            onClick={onClick}
            className="bg-card hover:bg-muted/50 border rounded-lg p-4 transition-all cursor-pointer group relative hover:shadow-sm"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{date}</span>
                    </div>
                    <p className="font-medium text-sm line-clamp-2 leading-relaxed">
                        {note.transcript}
                    </p>
                </div>

                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 hover:text-red-500 rounded-md transition-all"
                    title="Delete note"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-3 flex gap-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <FileText className="h-3 w-3" />
                    {note.keyPoints.length} Points
                </div>
            </div>
        </div>
    );
};
