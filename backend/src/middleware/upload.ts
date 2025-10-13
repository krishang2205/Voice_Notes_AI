import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../config/paths';

/**
 * Validates that the uploaded directory exists.
 * Creates it if missing.
 */
if (!fs.existsSync(UPLOAD_DIR)) {
    try {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        console.log(`Created upload directory at: ${UPLOAD_DIR}`);
    } catch (err) {
        console.error(`Failed to create upload directory at ${UPLOAD_DIR}`, err);
    }
}

/**
 * Custom storage engine configuration.
 * Saves files with a unique timestamp to prevent collisions.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // timestamp-random-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const saneName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `${uniqueSuffix}-${saneName}`);
    },
});

/**
 * allowedMimeTypes - List of strict audio mime types we support.
 */
const allowedMimeTypes = [
    'audio/webm',
    'audio/ogg',
    'audio/wav',
    'audio/mpeg',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'application/octet-stream' // Sometimes legitimate for generic binary blobs
];

/**
 * fileFilter - Validates uploaded file type against allowed list.
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // 1. Check Mime Type
    if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
        // 2. Double check extension if possible (basic security)
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.webm', '.wav', '.mp3', '.m4a', '.ogg', '.mp4'].includes(ext)) {
            cb(null, true);
        } else {
            console.warn(`Blocked file with valid mime but invalid extension: ${file.originalname}`);
            cb(new Error('Invalid file extension. Allowed: .webm, .wav, .mp3, .m4a, .ogg'));
        }
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only audio files are allowed!`));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // Increased to 50MB for longer recordings
    },
});
