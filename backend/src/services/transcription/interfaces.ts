export interface TranscriptionResult {
    text: string;
    duration?: number;
    language?: string;
}

export interface ITranscriptionService {
    transcribe(audioPath: string): Promise<TranscriptionResult>;
}
