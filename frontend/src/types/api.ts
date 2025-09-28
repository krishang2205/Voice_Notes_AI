export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export interface VoiceNoteResult {
    transcript: string;
    keyPoints: string[];
    actionItems: string[];
}

export interface UploadResponse extends ApiResponse<VoiceNoteResult> {
    file?: {
        filename: string;
        originalName: string;
    };
}
