import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { VoiceNoteResult } from '../types/api';

/**
 * Represents a stored voice note in the application state.
 * Extends the API result with local metadata.
 */
export interface VoiceNote extends VoiceNoteResult {
    /** Unique identifier for the note (UUID) */
    id: string;
    /** Timestamp when the note was created (ms) */
    createdAt: number;
}

/**
 * Definition of the Voice Notes Context state and actions.
 */
interface VoiceNotesContextType {
    /** List of all saved voice notes, ordered by creation time usually */
    notes: VoiceNote[];
    /** Actions to add a new note after processing */
    addNote: (note: VoiceNoteResult) => void;
    /** Action to permanently remove a note by ID */
    deleteNote: (id: string) => void;
    /** Selector to retrieve a single note by ID */
    getNote: (id: string) => VoiceNote | undefined;
}

const VoiceNotesContext = createContext<VoiceNotesContextType | undefined>(undefined);

/**
 * Provider component that wraps the application to provide voice note state.
 * Handles persistence to localStorage automatically.
 * 
 * @param children Child components
 */
export const VoiceNotesProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<VoiceNote[]>(() => {
        try {
            const saved = localStorage.getItem('voice-notes');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load notes from storage:', e);
            return [];
        }
    });

    /**
     * persistentAddNote - Adds a note and saves to local storage.
     * Generates a new UUID and timestamp.
     */
    const addNote = (result: VoiceNoteResult) => {
        const newNote: VoiceNote = {
            ...result,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };

        const updated = [newNote, ...notes];
        setNotes(updated);
        try {
            localStorage.setItem('voice-notes', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save notes:', e);
        }
    };

    /**
     * persistentDeleteNote - Removes a note and updates local storage.
     */
    const deleteNote = (id: string) => {
        const updated = notes.filter((n) => n.id !== id);
        setNotes(updated);
        try {
            localStorage.setItem('voice-notes', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to update storage after delete:', e);
        }
    };

    const getNote = (id: string) => notes.find(n => n.id === id);

    return (
        <VoiceNotesContext.Provider value={{ notes, addNote, deleteNote, getNote }}>
            {children}
        </VoiceNotesContext.Provider>
    );
};

/**
 * Hook to access the voice notes state.
 * @throws Error if used outside of VoiceNotesProvider
 */
export const useVoiceNotes = () => {
    const context = useContext(VoiceNotesContext);
    if (!context) {
        throw new Error('useVoiceNotes must be used within a VoiceNotesProvider');
    }
    return context;
};
