export async function getRecipeFromMistral(ingredientsArr) {
    console.log('🔍 Starting recipe generation...')
    console.log('📝 Ingredients:', ingredientsArr)
    
    try {
        console.log('📡 Calling backend API...')
        
        // ────────────────────────────────────────────────
        // CHANGED: Use relative path instead of localhost
        // This works both locally (with proxy) and in production on Render
        // ────────────────────────────────────────────────
       const response = await fetch('https://recipe-generator-1-dqzo.onrender.com/recipe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ingredients: ingredientsArr })
})
        
        if (!response.ok) {
            let errorMessage = 'Failed to generate recipe';
            try {
                const error = await response.json();
                errorMessage = error.error || errorMessage;
            } catch {} // ignore json parse errors
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data.recipe;
        
    } catch (err) {
        console.error('❌ Error fetching recipe:', err);
        throw err;
    }
}