import { apiClient } from './api';
import type { UploadResponse } from '../types/api';

/**
 * Service for handling voice-related API interactions.
 * Primarily handles audio file uploads and processing triggers.
 */
export const voiceService = {
    /**
     * Uploads an audio blob to the backend for processing.
     * 
     * @param audioBlob - The recorded audio data (preferably webm/wav)
     * @returns Promise resolving to the processing results (summary, transcription)
     */
    uploadAudio: async (audioBlob: Blob): Promise<UploadResponse> => {
        const formData = new FormData();
        // Default to webm as that's what we are typically recording in browser
        // We add a timestamp to the filename to avoid collisions client-side, 
        // though backend handles renaming too.
        const filename = `recording_${Date.now()}.webm`;
        formData.append('audio', audioBlob, filename);

        try {
            const response = await apiClient.post<UploadResponse>('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Audio upload failed:', error);
            throw error;
        }
    },
};
