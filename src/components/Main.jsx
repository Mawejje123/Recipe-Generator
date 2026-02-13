import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "./ai";

export default function Main({ addToast }) {  // ← receive addToast from App.jsx
  const [ingredients, setIngredients] = React.useState(
    ["chicken", "fries", "heavy cream", "pasta"]
  );
  const [recipe, setRecipe] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");

  const loadingRef = React.useRef(null);      // ← new ref for loading spinner
  const recipeSection = React.useRef(null);   // ref for final recipe

  async function getRecipe() {
  setIsLoading(true);
  setRecipe(""); // clear old recipe

  // 1. Immediately scroll to the bottom of the ingredients list
  //    (spinner will appear right after it)
  if (recipeSection.current) {
    recipeSection.current.scrollIntoView({
      behavior: "smooth",
      block: "end",           // scroll to bottom of ingredients list
    });
  }

  try {
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);

    // 2. After generation finishes, scroll to the recipe
    setTimeout(() => {
      if (recipeSection.current) {
        recipeSection.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 400);

  } catch (err) {
    console.error("Recipe error:", err);
    addToast?.("Failed to generate recipe", "error");
  } finally {
    setIsLoading(false);
  }
}

  async function handleRegenerate() {
    // Same behavior as getRecipe — scroll to spinner first
    await getRecipe();
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient")?.trim();
    if (newIngredient) {
      setIngredients(prev => [...prev, newIngredient]);
    }
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  function startEdit(index) {
    setEditingIndex(index);
    setEditValue(ingredients[index]);
  }

  function saveEdit(index) {
    if (editValue.trim()) {
      setIngredients(prev =>
        prev.map((ing, i) => (i === index ? editValue.trim() : ing))
      );
    }
    cancelEdit();
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
  }

  function clearAllIngredients() {
    setIngredients([]);
  }

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
      {/* ── Form – 65% width centered, buttons on right ── */}
      <div className="form-wrapper">
        <form action={addIngredient} className="add-ingredient-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="e.g. oregano"
              aria-label="Add ingredient"
              name="ingredient"
              className="ingredient-input"
            />

            <div className="button-group">
              <button type="submit" className="add-btn">
                Add ingredient
              </button>

              {ingredients.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllIngredients}
                  className="clear-btn"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}  // final scroll target
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
          clearAllIngredients={clearAllIngredients}
        />
      )}

      {/* Loading indicator – now has ref for scrolling */}
      {isLoading && (
        <div
          ref={loadingRef}  // ← scroll target
          style={{
            textAlign: "center",
            margin: "4rem 0",
            minHeight: "240px", // gives enough space for smooth scroll
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#e0e0e0",
            fontSize: "1.3rem",
          }}
        >
          <div className="spinner" />
          {getLoadingMessage()}
          <br />
          <small style={{ opacity: 0.7, fontSize: "1rem" }}>
            This might take 5–15 seconds... AI chefs are dramatic 😅
          </small>
        </div>
      )}

      {recipe && (
        <>
          <ClaudeRecipe recipe={recipe} addToast={addToast} />
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