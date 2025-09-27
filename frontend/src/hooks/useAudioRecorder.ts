import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
    isRecording: boolean;
    duration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    cancelRecording: () => void;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        timerRef.current = window.setInterval(() => {
            setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setDuration(0);
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // Chrome/Firefox default
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimer();
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error; // Let UI handle error display
        }
    };

    const stopRecording = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = [];
                setIsRecording(false);
                stopTimer();

                // Stop all tracks to release microphone
                mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        stopTimer();
        chunksRef.current = [];
    };

    return {
        isRecording,
        duration,
        startRecording,
        stopRecording,
        cancelRecording
    };
};
