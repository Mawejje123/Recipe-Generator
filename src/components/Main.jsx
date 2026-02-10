import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "./ai";

// Main.jsx (only showing changed/added parts)

export default function Main() {
  const [ingredients, setIngredients] = React.useState(
    ["chicken", "fries", "heavy cream", "pasta"]
  );
  const [recipe, setRecipe] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState(null); // new: which item is being edited
  const [editValue, setEditValue] = React.useState("");         // new: temporary value while editing

  const recipeSection = React.useRef(null);

  async function getRecipe() {
        setIsLoading(true);
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
            setRecipe(recipeMarkdown);
            setTimeout(() => {
                recipeSection.current?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } catch (err) {
            console.error("Recipe error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRegenerate() {
        setIsLoading(true);
        try {
            const newRecipe = await getRecipeFromMistral(ingredients);
            setRecipe(newRecipe);
            // Optional: scroll again after regenerate
            setTimeout(() => {
                recipeSection.current?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } catch (err) {
            console.error("Regenerate error:", err);
        } finally {
            setIsLoading(false);
        }
    }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient")?.trim();
    if (newIngredient) {
      setIngredients(prev => [...prev, newIngredient]);
    }
  }

  // NEW: Remove one specific ingredient
  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  // NEW: Start editing an ingredient
  function startEdit(index) {
    setEditingIndex(index);
    setEditValue(ingredients[index]); // pre-fill current value
  }

  // NEW: Save edited value
  function saveEdit(index) {
    if (editValue.trim()) {
      setIngredients(prev =>
        prev.map((ing, i) => (i === index ? editValue.trim() : ing))
      );
    }
    cancelEdit();
  }

  // NEW: Cancel editing
  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
  }

  // NEW: Clear ALL ingredients
  function clearAllIngredients() {
    setIngredients([]);
  }

  // Random fun loading message
    const getLoadingMessage = () => {
        const messages = [
            "Cooking up something delicious...",
            "Adding extra magic... 🍌",
            "The chef is tasting for perfection... 👨🏾‍🍳",
            "Best sauce levels incoming... 🥜",
            "Exquisite is rising in the background...",
            "Flavors about to explode! 🔥",
            "Stirring with love and a bit of chili..."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

  return (
    <main>
      {
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
                            onClick={clearAllIngredients}
                            style={{
                                backgroundColor: "#e74c3c",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Clear all ingredients
                        </button>
                    )}
                </div>
            </form>
      }

      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
          isLoading={isLoading}
          editingIndex={editingIndex}
          editValue={editValue}
          setEditValue={setEditValue}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          removeIngredient={removeIngredient}
          clearAllIngredients={clearAllIngredients}  // new prop
        />
      )}

    {/* ── Loading indicator ── */}
            {isLoading && (
                <div style={{ 
                    textAlign: "center", 
                    margin: "3rem 0", 
                    fontSize: "1.3rem",
                    color: "#e0e0e0" // light for dark theme
                }}>
                    <div 
                        className="spinner" 
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "6px solid #444",
                            borderTop: "6px solid #ff6b6b",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 1.2rem"
                        }}
                    />
                    {getLoadingMessage()}
                    <br />
                    <small style={{ opacity: 0.7, fontSize: "1rem" }}>
                        This might take 5–15 seconds... AI chefs are dramatic 😅
                    </small>
                </div>
            )}

            {recipe && (
                <>
                    <ClaudeRecipe recipe={recipe} />
                    <button
                        onClick={handleRegenerate}
                        disabled={isLoading}
                        style={{
                            margin: "2rem auto",
                            padding: "12px 28px",
                            fontSize: "1.15rem",
                            backgroundColor: "#e67e22",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "block",
                            fontWeight: "bold"
                        }}
                    >
                        🔥 Regenerate (surprise me again!)
                    </button>
                </>
            )}
    </main>
  );
}