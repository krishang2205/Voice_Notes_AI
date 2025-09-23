import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { MockTranscriptionService } from '../services/transcription/mockService';
import { OpenAIService } from '../services/ai/openai';
import { VoiceAIOrchestrator } from '../controllers/orchestrator';

const router = Router();
const transcriptionService = new MockTranscriptionService();
const openAIService = new OpenAIService();
const orchestrator = new VoiceAIOrchestrator(transcriptionService, openAIService);

router.post('/', upload.single('audio'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No audio file uploaded' });
    }

    try {
        // Pipeline: Audio -> Transcript -> AI Analysis
        const result = await orchestrator.processAudio(req.file.path);

        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('Processing error:', error);
        // In production, checking 'instanceof' specific error types is better
        res.status(500).json({
            status: 'error',
            message: 'Failed to process audio',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
