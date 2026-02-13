// api/recipe.js – Vercel serverless function
import { Mistral } from '@mistralai/mistralai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    console.log('Generating recipe for:', ingredients);

    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const chatResponse = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: `You are a world-class chef. Generate a delicious, detailed recipe using these ingredients: ${ingredients.join(', ')}. 
          Format in clean markdown with:
          - # Main Title
          - ## Ingredients list
          - ## Step-by-step instructions
          - Optional: tips, variations, or Ugandan twists if ingredients match.`,
        },
      ],
    });

    const recipeText = chatResponse.choices[0].message.content;

    res.status(200).json({ recipe: recipeText });
  } catch (error) {
    console.error('Mistral API error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}