import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordingView } from '../components/RecordingView';
import { voiceService } from '../services/voice';
import { ProcessingSkeleton } from '../components/ProcessingSkeleton';
import { TranscriptionViewer } from '../components/TranscriptionViewer';
import { VoiceNoteResult } from '../types/api';

export default function Home() {
    const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<VoiceNoteResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStop = async () => {
        const audioBlob = await stopRecording();
        if (audioBlob) {
            setIsProcessing(true);
            setError(null);
            try {
                const response = await voiceService.uploadAudio(audioBlob);
                if (response.data) {
                    setResult(response.data);
                }
            } catch (err) {
                console.error('Upload failed', err);
                setError('Failed to process recording. Please try again.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    if (isRecording) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <RecordingView
                    duration={duration}
                    onStop={handleStop}
                    onCancel={cancelRecording}
                />
            </div>
        );
    }

    if (isProcessing) {
        return <ProcessingSkeleton />;
    }

    if (result) {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500 pb-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Result</h2>
                    <button onClick={handleReset} className="text-sm text-primary hover:underline">Record New</button>
                </div>

                <TranscriptionViewer text={result.transcript} />

                {/* Placeholder for AI Summary (Next Step) */}
                <div className="p-4 border rounded-lg bg-muted/5 opacity-50">
                    <p className="text-center text-muted-foreground text-sm">AI Summary Component Coming Soon...</p>
                </div>
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
                <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-md max-w-sm">
                    {error}
                </div>
            )}

            <button
                onClick={startRecording}
                className="group relative h-32 w-32 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-all shadow-xl hover:shadow-primary/25"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                <Mic className="h-12 w-12 text-primary-foreground group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground/80">
                Tap to start recording
            </p>
        </div>
    );
}
