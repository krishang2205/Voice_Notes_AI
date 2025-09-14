import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'Voice Notes AI Backend' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
