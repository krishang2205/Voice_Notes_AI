import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordingView } from '../components/RecordingView';
import { voiceService } from '../services/voice';
import { ProcessingSkeleton } from '../components/ProcessingSkeleton';
import { TranscriptionViewer } from '../components/TranscriptionViewer';
import { ActionItemList } from '../components/ActionItemList';
import { KeyPointsList } from '../components/KeyPointsList';
import { useVoiceNotes } from '../context/VoiceNotesContext';
import { VoiceNoteResult } from '../types/api';

import { useRef } from 'react';
import { AudioPlayer } from '../components/AudioPlayer';

export default function Home() {
    const {
        isRecording,
        duration,
        startRecording,
        stopRecording,
        cancelRecording,
        rawStream,
        pauseRecording,
        resumeRecording,
        error: recorderError,
        clearError
    } = useAudioRecorder();

    const { addNote } = useVoiceNotes();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<VoiceNoteResult | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // [NEW] Track blob
    const [error, setError] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Sync recorder errors to UI
    React.useEffect(() => {
        if (recorderError) {
            setError(recorderError);
            clearError();
        }
    }, [recorderError, clearError]);

    import { toast } from 'sonner';

    // ...

    const handleStop = async () => {
        const blob = await stopRecording();
        if (blob) {
            setIsProcessing(true);
            setError(null);
            setAudioBlob(blob);

            // Show processing toast
            const toastId = toast.loading('Processing audio...');

            try {
                const response = await voiceService.uploadAudio(blob);
                if (response.data) {
                    setResult(response.data);
                    addNote({
                        ...response.data,
                    });
                    toast.success('Note saved successfully!', { id: toastId });
                }
            } catch (err) {
                console.error('Upload failed', err);
                const msg = 'Failed to process recording. Please check your connection.';
                setError(msg);
                toast.error(msg, { id: toastId });
            } finally {
                setIsProcessing(false);
                setIsPaused(false);
            }
        }
    };

    const handlePauseToggle = () => {
        if (isPaused) {
            resumeRecording();
            setIsPaused(false);
        } else {
            pauseRecording();
            setIsPaused(true);
        }
    };

    const handleReset = () => {
        setResult(null);
        setAudioBlob(null);
        setError(null);
    };

    if (isRecording) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4">
                <RecordingView
                    duration={duration}
                    rawStream={rawStream}
                    isPaused={isPaused}
                    onStop={handleStop}
                    onCancel={cancelRecording}
                    onPause={handlePauseToggle}
                    onResume={handlePauseToggle}
                />
            </div>
        );
    }

    if (isProcessing) {
        return <ProcessingSkeleton />;
    }

    if (result) {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500 pb-10 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Analysis Result</h2>
                        <p className="text-sm text-muted-foreground">Session completed successfully</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                        <Mic className="h-4 w-4" />
                        Record New
                    </button>
                </div>

                {/* Audio Player Section */}
                <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Original Recording</h3>
                    <AudioPlayer blob={audioBlob || undefined} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <KeyPointsList points={result.keyPoints} />
                    <ActionItemList items={result.actionItems} />
                </div>

                <TranscriptionViewer text={result.transcript} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Voice Notes AI</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Capture your thoughts instantly. We'll transcribe and organize them for you.
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-md max-w-sm border border-red-200">
                    {error}
                </div>
            )}

            <button
                onClick={startRecording}
                className="group relative h-32 w-32 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-all shadow-xl hover:shadow-primary/25"
                title="Start Recording"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                <Mic className="h-12 w-12 text-primary-foreground group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground/80 font-medium">
                Tap to start recording
            </p>
        </div>
    );
}
