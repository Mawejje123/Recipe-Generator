export async function getRecipeFromMistral(ingredientsArr) {
    console.log('🔍 Starting recipe generation...')
    console.log('📝 Ingredients:', ingredientsArr)
    
    try {
        console.log('📡 Calling backend API...')
        
        const response = await fetch('http://localhost:3001/api/recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientsArr })
        })
        
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to generate recipe')
        }
        
        const data = await response.json()
        return data.recipe
        
    } catch (err) {
        console.error('❌ Error:', err)
        throw err
    }
}