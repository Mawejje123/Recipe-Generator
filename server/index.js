import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

console.log('HF Token read from .env:', process.env.HF_ACCESS_TOKEN);


const app = express();
app.use(cors());
app.use(express.json());

/* ✅ Health check route */
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

const SYSTEM_PROMPT =
    'You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You do not need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they did not mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page';

app.post('/api/recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Ingredients must be an array' });
        }

        const ingredientsString = ingredients.join(', ');
        console.log('Generating recipe for:', ingredientsString);

        const prompt =
            '<s>[INST] ' +
            SYSTEM_PROMPT +
            '\n\nI have ' +
            ingredientsString +
            '. Please give me a recipe you would recommend I make! [/INST]';

        const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.2-3B-Instruct',
    {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.HF_ACCESS_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                max_new_tokens: 1024,
                temperature: 0.7,
                top_p: 0.95,
                return_full_text: false,
            },
            options: {
                wait_for_model: true,
                use_cache: false,
            },
        }),
    }
);


        console.log('Response status:', response.status);

        const textResponse = await response.text();
        console.log('Raw response preview:', textResponse.substring(0, 200));

        if (!response.ok) {
            return res.status(response.status).json({
                error: textResponse || 'Failed to generate recipe',
            });
        }

        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (err) {
            return res.status(500).json({
                error: 'Invalid response from AI model',
                raw: textResponse.substring(0, 200),
            });
        }

        let recipeText;
        if (Array.isArray(data)) {
            recipeText = data[0]?.generated_text;
        } else if (data?.generated_text) {
            recipeText = data.generated_text;
        }

        if (!recipeText) {
            return res.status(500).json({ error: 'No recipe generated' });
        }

        console.log('Recipe generated successfully');
        res.json({ recipe: recipeText });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('HF Token configured:', !!process.env.HF_ACCESS_TOKEN);
});
