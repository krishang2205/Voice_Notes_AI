import React from 'react';
import { useVoiceNotes } from '../context/VoiceNotesContext';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { AudioPlayer } from '../components/AudioPlayer';

export default function History() {
    const { notes, deleteNote } = useVoiceNotes();
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (notes.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-500">
                <Clock className="h-12 w-12 mb-4 opacity-20" />
                <p>No recording history yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <h1 className="text-2xl font-bold">History</h1>

            <div className="grid gap-4">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={cn(
                            "bg-card border rounded-lg overflow-hidden transition-all duration-300 shadow-sm",
                            expandedId === note.id ? "ring-2 ring-primary/20" : "hover:border-primary/50"
                        )}
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(note.id)}
                        >
                            <div className="space-y-1">
                                <div className="font-medium flex items-center gap-2">
                                    <span>Recording {new Date(note.createdAt).toLocaleDateString()}</span>
                                    {note.duration && (
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                            {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(note.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNote(note.id);
                                }}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Note"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Expanded Content */}
                        {expandedId === note.id && (
                            <div className="border-t bg-muted/30 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                {note.audioUrl && (
                                    // Use 'localhost:3000' prefix if dev, or relative in prod. 
                                    // Since we are in separate frontend, we need full URL.
                                    // Normally we configure a base API URL.
                                    // For now, assume proxy or direct. 
                                    <AudioPlayer src={`http://localhost:3000${note.audioUrl}`} />
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Key Points</h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                                            {note.keyPoints.slice(0, 3).map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Summary</h4>
                                        <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                                            {note.transcript.substring(0, 150)}...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
