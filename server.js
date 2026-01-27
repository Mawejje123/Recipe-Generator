// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';  // loads .env automatically
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: send index.html for non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const app = express();
app.use(express.json());
app.use(cors());

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'Qwen/Qwen2.5-7B-Instruct';  // Recommended: solid, instruct-tuned, usually available on free tier

app.post('/api/recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients array is required' });
        }

        console.log('Generating recipe for:', ingredients);

        const prompt = `
You are a world-class chef. Create a delicious, creative recipe using MOSTLY these ingredients: ${ingredients.join(', ')}.
Include title, ingredients list (with approximate quantities), step-by-step instructions, estimated time, servings, and any nice tips.
Return pure markdown only – no extra chit-chat.
        `.trim();

        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: HF_MODEL,
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('HF router error:', errorData);
            throw new Error(errorData.error?.message || `HF API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const recipe = data.choices?.[0]?.message?.content;

        if (!recipe) {
            throw new Error('No recipe content received from model');
        }

        console.log('Recipe generated successfully!');
        res.json({ recipe });

    } catch (err) {
        console.error('❌ Error in /api/recipe:', err.message);
        res.status(500).json({ error: err.message || 'Failed to generate recipe' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});