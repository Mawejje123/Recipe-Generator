import React from "react"
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"
import { getRecipeFromMistral } from "./ai"   // assuming you're now only using Mistral

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["chicken", "all the main spices", "corn", "heavy cream", "pasta"]
    )
    const [recipe, setRecipe] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false) // nice to have
    const recipeSection = React.useRef(null)

    async function getRecipe() {
        setIsLoading(true)
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
            setTimeout(() => {
                recipeSection.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        } catch (err) {
            console.error("Recipe error:", err)
            // Optional: alert("Something went wrong generating the recipe")
        } finally {
            setIsLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")?.trim()
        if (newIngredient) {
            setIngredients(prev => [...prev, newIngredient])
        }
    }

    function removeLastIngredient() {
        if (ingredients.length > 0) {
            setIngredients(prev => prev.slice(0, -1))
        }
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button type="submit">Add ingredient</button>
                    {ingredients.length > 0 && (
                        <button
                            type="button"
                            onClick={removeLastIngredient}
                            style={{
                                backgroundColor: "#e74c3c",     // red-ish
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Remove last
                        </button>
                    )}
                </div>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList
                    ref={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}   // pass if you want to disable button while loading
                />
            )}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}