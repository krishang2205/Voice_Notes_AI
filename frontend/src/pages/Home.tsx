import React from 'react';
import { Mic } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordingView } from '../components/RecordingView';

export default function Home() {
    const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useAudioRecorder();

    const handleStop = async () => {
        const audioBlob = await stopRecording();
        if (audioBlob) {
            console.log('Recording finished:', audioBlob.size, 'bytes');
            // TODO: Upload logic will go here
        }
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

    return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Voice Notes AI</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Capture your thoughts instantly. We'll transcribe and organize them for you.
                </p>
            </div>

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
