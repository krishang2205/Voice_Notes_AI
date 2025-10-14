import React, { useState, useMemo } from 'react';
import { useVoiceNotes } from '../context/VoiceNotesContext';
import { Calendar, Clock, Trash2, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { AudioPlayer } from '../components/AudioPlayer';

export default function History() {
    const { notes, deleteNote } = useVoiceNotes();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredNotes = useMemo(() => {
        return notes.filter(note =>
            note.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.keyPoints.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [notes, searchQuery]);

    if (notes.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-500 space-y-4">
                <div className="bg-muted/30 p-6 rounded-full">
                    <Clock className="h-12 w-12 opacity-20" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground">No recording history</h3>
                    <p className="text-sm">Your voice notes will appear here once you start recording.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">History</h1>
                    <p className="text-sm text-muted-foreground">Manage your past voice notes</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search transcripts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No notes found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            className={cn(
                                "bg-card border rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
                                expandedId === note.id ? "ring-1 ring-primary/30 border-primary/30" : "hover:border-primary/50"
                            )}
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer select-none"
                                onClick={() => toggleExpand(note.id)}
                            >
                                <div className="space-y-1 flex-1 min-w-0 pr-4">
                                    <div className="font-medium flex items-center gap-2 flex-wrap">
                                        <span className="truncate">Recording {new Date(note.createdAt).toLocaleDateString()}</span>
                                        {note.duration && (
                                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-mono">
                                                {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(note.createdAt).toLocaleTimeString()}
                                        </span>
                                        <span className="hidden md:inline-block truncate max-w-[300px] text-muted-foreground/70">
                                            {note.transcript.substring(0, 50)}...
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this note?')) {
                                            deleteNote(note.id);
                                        }
                                    }}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                    title="Delete Note"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Expanded Content */}
                            {expandedId === note.id && (
                                <div className="border-t bg-muted/30 p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                    {note.audioUrl && (
                                        <div className="bg-card border rounded p-3">
                                            <AudioPlayer src={`http://localhost:3000${note.audioUrl}`} />
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <Filter className="h-3 w-3" /> Key Points
                                            </h4>
                                            <ul className="space-y-2">
                                                {note.keyPoints.map((p, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-primary/20">
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold">Transcript Preview</h4>
                                            <p className="text-sm text-muted-foreground bg-background p-4 rounded-md border leading-relaxed">
                                                {note.transcript}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
