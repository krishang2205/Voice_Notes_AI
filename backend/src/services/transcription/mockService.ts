import { ITranscriptionService, TranscriptionResult } from './interfaces';

/**
 * Mock implementation of the Transcription Service.
 * Used for testing and development to avoid API costs.
 */
export class MockTranscriptionService implements ITranscriptionService {
    async transcribe(audioPath: string): Promise<TranscriptionResult> {
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            text: "This is a mock transcription of the audio file. In a real scenario, this text would come from OpenAI Whisper or AssemblyAI. It demonstrates that the system can process audio and return text successfully.",
            duration: 15.5,
            language: 'en',
        };
    }
}
