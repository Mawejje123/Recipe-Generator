import React from "react"
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"
import { getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["chicken", "all the main spices", "corn", "heavy cream", "pasta"]
    )
    const [recipe, setRecipe] = React.useState("")
    const recipeSection = React.useRef(null)

    React.useEffect(() => {
        if(recipe !== "" && recipeSection.current !== null) {
            // recipeSection.current.scrollIntoView()
            const yCoordinate = recipeSection.current.getBoundingClientRect().top + window.pageYOffset - 20
            window.scrollTo({ 
                top: yCoordinate, 
                behavior: 'smooth' 
            })
        }
    }, [recipe])

  async function getRecipe() {
    try {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
        // Optional smooth scroll to recipe section
        setTimeout(() => {
            recipeSection.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    } catch (err) {
        console.error("Failed to get recipe:", err);
        // TODO: show user-friendly error message in UI if you want
    }
}
    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
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
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ref={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}