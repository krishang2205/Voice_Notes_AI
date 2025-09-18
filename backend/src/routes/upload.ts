import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('audio'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No audio file uploaded' });
    }

    res.json({
        status: 'success',
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
        },
    });
});

export default router;
