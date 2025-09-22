import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { MockTranscriptionService } from '../services/transcription/mockService';

const router = Router();
const transcriptionService = new MockTranscriptionService();

router.post('/', upload.single('audio'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No audio file uploaded' });
    }

    try {
        // Start transcription
        const transcript = await transcriptionService.transcribe(req.file.path);

        res.json({
            status: 'success',
            message: 'File processed successfully',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
            },
            transcription: transcript
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
