export interface TranscriptionResult {
    /** The transcribed text */
    text: string;
    /** Duration of the audio in seconds */
    duration?: number;
    /** Detected language code (e.g., 'en', 'fr') */
    language?: string;
}

export interface ITranscriptionService {
    /**
     * Transcribes an audio file at the given path.
     * @param audioPath Absolute path to the audio file
     * @returns Promise resolving to the transcription result
     */
    transcribe(audioPath: string): Promise<TranscriptionResult>;
}
