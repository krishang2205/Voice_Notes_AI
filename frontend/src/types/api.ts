export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export interface VoiceNoteResult {
    transcript: string;
    keyPoints: string[];
    actionItems: string[];
    audioUrl?: string;
    fileName?: string;
    duration?: number;
    createdAt?: number;
}

export interface UploadResponse extends ApiResponse<VoiceNoteResult> {
    file?: {
        filename: string;
        originalName: string;
    };
}
