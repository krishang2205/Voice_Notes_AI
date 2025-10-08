import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../config/paths';

export const getFilePath = (filename: string): string => {
    return path.join(UPLOAD_DIR, filename);
};

export const deleteFile = (filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const filePath = getFilePath(filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                // If file doesn't exist, ignore error
                if (err.code === 'ENOENT') {
                    resolve();
                } else {
                    reject(err);
                }
            } else {
                resolve();
            }
        });
    });
};

export const cleanupOldFiles = (maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> => {
    return new Promise((resolve, reject) => {
        fs.readdir(UPLOAD_DIR, (err, files) => {
            if (err) {
                return reject(err);
            }

            const now = Date.now();
            let deletedCount = 0;
            const deletePromises: Promise<void>[] = [];

            files.forEach((file) => {
                const filePath = path.join(UPLOAD_DIR, file);
                deletePromises.push(new Promise<void>((res) => {
                    fs.stat(filePath, (err, stats) => {
                        if (err) return res(); // Skip if stat fails

                        if (now - stats.mtimeMs > maxAgeMs) {
                            fs.unlink(filePath, (err) => {
                                if (!err) deletedCount++;
                                res();
                            });
                        } else {
                            res();
                        }
                    });
                }));
            });

            Promise.all(deletePromises).then(() => resolve(deletedCount));
        });
    });
};
