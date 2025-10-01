import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VoiceNoteResult } from '../types/api';

export interface VoiceNote extends VoiceNoteResult {
    id: string;
    createdAt: number;
}

interface VoiceNotesContextType {
    notes: VoiceNote[];
    addNote: (note: VoiceNoteResult) => void;
    deleteNote: (id: string) => void;
    getNote: (id: string) => VoiceNote | undefined;
}

const VoiceNotesContext = createContext<VoiceNotesContextType | undefined>(undefined);

export const VoiceNotesProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<VoiceNote[]>(() => {
        // Basic persistence
        const saved = localStorage.getItem('voice-notes');
        return saved ? JSON.parse(saved) : [];
    });

    const addNote = (result: VoiceNoteResult) => {
        const newNote: VoiceNote = {
            ...result,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };

        const updated = [newNote, ...notes];
        setNotes(updated);
        localStorage.setItem('voice-notes', JSON.stringify(updated));
    };

    const deleteNote = (id: string) => {
        const updated = notes.filter((n) => n.id !== id);
        setNotes(updated);
        localStorage.setItem('voice-notes', JSON.stringify(updated));
    };

    const getNote = (id: string) => notes.find(n => n.id === id);

    return (
        <VoiceNotesContext.Provider value={{ notes, addNote, deleteNote, getNote }}>
            {children}
        </VoiceNotesContext.Provider>
    );
};

export const useVoiceNotes = () => {
    const context = useContext(VoiceNotesContext);
    if (!context) {
        throw new Error('useVoiceNotes must be used within a VoiceNotesProvider');
    }
    return context;
};
