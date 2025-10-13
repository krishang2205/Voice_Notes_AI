import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Return type includes error state and detailed functionality
 */
interface UseAudioRecorderReturn {
    /** True if recording is active */
    isRecording: boolean;
    /** Current duration in seconds */
    duration: number;
    /** Error message, if any */
    error: string | null;
    /** Request microphone access and start recording */
    startRecording: () => Promise<void>;
    /** Stop recording and return the audio blob */
    stopRecording: () => Promise<Blob | null>;
    /** Cancel current recording without saving */
    cancelRecording: () => void;
    /** Reset error state */
    clearError: () => void;
}

/**
 * determineMimeType - Finds a supported audio mime type for the current browser.
 */
const determineMimeType = (): string => {
    const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav' // Fallback
    ];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }
    return ''; // Let browser decide default if none match explicitly, though unlikely.
};

/**
 * Custom hook to manage audio recording logic using the MediaRecorder API.
 * Handles timer, permission overrides, and cross-browser quirks.
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopTimer();
            cleanupTracks();
        };
    }, []);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        setDuration(0);
        timerRef.current = window.setInterval(() => {
            setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const cleanupTracks = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const clearError = () => setError(null);

    const startRecording = async () => {
        setError(null);
        try {
            // Request permissions specifically
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            streamRef.current = stream;

            const mimeType = determineMimeType();
            const options = mimeType ? { mimeType } : undefined;

            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            // Handle unexpected stops (e.g., mic unplugged)
            mediaRecorder.onstop = () => {
                stopTimer();
                setIsRecording(false);
            };

            mediaRecorder.onerror = (event: any) => {
                const errMessage = event.error?.name || 'Unknown Recorder Error';
                console.error('MediaRecorder Error:', errMessage);
                setError(`Recording error: ${errMessage}`);
                cancelRecording();
            };

            mediaRecorder.start(1000); // Slice into 1 second chunks for safety
            setIsRecording(true);
            startTimer();
        } catch (err: any) {
            console.error('Failed to start recording:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Microphone permission denied. Please enable it in settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No microphone found.');
            } else {
                setError('Failed to access microphone.');
            }
        }
    };

    const stopRecording = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const recorder = mediaRecorderRef.current;
            if (!recorder || recorder.state === 'inactive') {
                resolve(null);
                return;
            }

            recorder.onstop = () => {
                let blobType = recorder.mimeType || 'audio/webm';
                // Some browsers return empty mimeType on the blob
                const blob = new Blob(chunksRef.current, { type: blobType });

                chunksRef.current = [];
                setIsRecording(false);
                stopTimer();
                cleanupTracks();

                resolve(blob);
            };

            recorder.stop();
        });
    };

    const cancelRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== 'inactive') {
            recorder.stop();
        }
        chunksRef.current = [];
        setIsRecording(false);
        stopTimer();
        cleanupTracks();
    };

    return {
        isRecording,
        duration,
        error,
        startRecording,
        stopRecording,
        cancelRecording,
        clearError
    };
};
