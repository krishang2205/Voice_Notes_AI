import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordingView } from '../components/RecordingView';
import { voiceService } from '../services/voice';
import { ProcessingSkeleton } from '../components/ProcessingSkeleton';
import { TranscriptionViewer } from '../components/TranscriptionViewer';
import { ActionItemList } from '../components/ActionItemList';
import { KeyPointsList } from '../components/KeyPointsList';

export default function Home() {
    const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
    // ... (rest of the component)

    if (result) {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500 pb-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Result</h2>
                    <button onClick={handleReset} className="text-sm text-primary hover:underline">Record New</button>
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
