// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';  // loads .env automatically

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the Vite build (dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: send index.html for all non-API routes
// Using regex instead of '*' to avoid path-to-regexp error in ESM + recent Node versions
app.get(/(.*)/, (req, res) => {
    // Optional: skip API routes (though they are handled separately)
    if (req.path.startsWith('/api/')) {
        return res.status(404).send('Not Found');
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'Qwen/Qwen2.5-7B-Instruct';  // or any other supported model

app.post('/api/recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients array is required' });
        }

        console.log('Generating recipe for:', ingredients);

        const prompt = `
You are a world-class chef. Create a delicious, creative recipe using MOSTLY these ingredients