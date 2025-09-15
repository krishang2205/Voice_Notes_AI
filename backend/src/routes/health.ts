import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        service: 'Voice Notes AI Backend',
        timestamp: new Date().toISOString()
    });
});

export default router;
