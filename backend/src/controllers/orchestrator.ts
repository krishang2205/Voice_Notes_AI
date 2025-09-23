import { ITranscriptionService } from '../services/transcription/interfaces';
import { OpenAIService } from '../services/ai/openai';
import { SUMMARY_PROMPT } from '../services/ai/prompts';

export interface VoiceNoteResult {
  transcript: string;
  keyPoints: string[];
  actionItems: string[];
}

export class VoiceAIOrchestrator {
  constructor(
    private transcriptionService: ITranscriptionService,
    private aiService: OpenAIService
  ) { }

  async processAudio(filePath: string): Promise<VoiceNoteResult> {
    // 1. Transcribe
    const transcriptResult = await this.transcriptionService.transcribe(filePath);
    const transcriptText = transcriptResult.text;

    // 2. Generate Summary/Actions using OpenAI
    const prompt = `${SUMMARY_PROMPT}\n\nTranscript:\n${transcriptText}`;

    // Note: In a real app, we might handle token limits here
    const aiResponse = await this.aiService.generateCompletion(prompt);

    let parsedResult = { key_points: [], action_items: [] };
    try {
      if (aiResponse) {
        // Robust parsing in case of markdown blocks
        const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleanJson);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback or re-throw
    }

    return {
      transcript: transcriptText,
      keyPoints: parsedResult.key_points || [],
      actionItems: parsedResult.action_items || []
    };
  }
}
