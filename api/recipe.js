// api/recipe.js – Vercel serverless function for Hugging Face
console.log('API route loaded successfully!');

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

    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
      console.error('Missing HF_API_KEY environment variable');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const prompt = `You are a world-class chef. Generate a delicious, detailed recipe using these ingredients: ${ingredients.join(', ')}. 
Format in clean markdown with:
- # Main Title
- ## Ingredients list
- ## Step-by-step instructions
- Optional: tips, variations, or Ugandan twists if ingredients match.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      return res.status(response.status).json({ error: error.error || 'API request failed' });
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text?.trim() || '';

    if (!generatedText) {
      return res.status(500).json({ error: 'No recipe generated' });
    }

    res.status(200).json({ recipe: generatedText });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}