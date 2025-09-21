import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIService {
    private client: OpenAI;

    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY is not set. AI features will fail.');
        }
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateCompletion(prompt: string, model = 'gpt-4o-mini'): Promise<string | null> {
        try {
            const response = await this.client.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI Error:', error);
            throw error;
        }
    }

    async transcribe(audioPath: string): Promise<string> {
        // Placeholder for Whisper integration if we move it here
        throw new Error("Use TranscriptionService instead");
    }
}
