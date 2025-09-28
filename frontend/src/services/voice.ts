import { apiClient } from './api';
import { UploadResponse } from '../types/api';

export const voiceService = {
    uploadAudio: async (audioBlob: Blob): Promise<UploadResponse> => {
        const formData = new FormData();
        // Default to webm as that's what we are recording
        formData.append('audio', audioBlob, 'recording.webm');

        const response = await apiClient.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};
