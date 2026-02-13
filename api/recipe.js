// api/recipe.js
import express from 'express';
import cors from 'cors';
import { Mistral } from '@mistralai/mistralai';

const app = express();
app.use(cors());
app.use(express.json());

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

app.post('/', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    const prompt = `Generate a creative recipe using these ingredients: ${ingredients.join(', ')}. Make it delicious, step-by-step, and fun.`;

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }]
    });

    const recipeText = response.choices[0].message.content;

    res.json({ recipe: recipeText });
  } catch (error) {
    console.error('Mistral API error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

// Export for Vercel
export default app;