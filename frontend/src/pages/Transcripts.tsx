import React, { useState } from 'react';
import { useVoiceNotes } from '../context/VoiceNotesContext';
import { NoteCard } from '../components/NoteCard';
import { TranscriptionViewer } from '../components/TranscriptionViewer';
import { ActionItemList } from '../components/ActionItemList';
import { KeyPointsList } from '../components/KeyPointsList';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Transcripts() {
    const { notes, deleteNote } = useVoiceNotes();
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const selectedNote = notes.find((n) => n.id === selectedNoteId);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(id);
            toast.success('Note deleted successfully');
            if (selectedNoteId === id) setSelectedNoteId(null);
        }
    };

    if (selectedNote) {
        return (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
                <button
                    onClick={() => setSelectedNoteId(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to List
                </button>

                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold">Note Detail</h2>
                    <button
                        onClick={(e) => handleDelete(e, selectedNote.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <KeyPointsList points={selectedNote.keyPoints} />
                    <ActionItemList items={selectedNote.actionItems} />
                </div>

                <TranscriptionViewer text={selectedNote.transcript} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Your Transcripts</h1>
                <span className="text-muted-foreground text-sm">{notes.length} notes</span>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                    <p className="text-muted-foreground">No transcripts yet. Go record something!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onClick={() => setSelectedNoteId(note.id)}
                            onDelete={(e) => handleDelete(e, note.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
