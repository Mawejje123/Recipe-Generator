// IngredientsList.jsx
import React from "react";

export default function IngredientsList(props) {
  const {
    ingredients,
    getRecipe,
    isLoading,
    editingIndex,
    editValue,
    setEditValue,
    startEdit,
    saveEdit,
    cancelEdit,
    removeIngredient,
    clearAllIngredients,
  } = props;

  return (
    <section className="ingredients-section">
      <h2>Ingredients on hand:</h2>

            <ul className="ingredients-list" aria-live="polite">
        {ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
            {editingIndex === index ? (
                // Editing mode – keep as is
                <div className="edit-mode">
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    className="edit-input"
                    aria-label={`Edit ingredient ${ingredient}`}
                />
                <button onClick={() => saveEdit(index)} className="save-btn">
                    Save
                </button>
                <button onClick={cancelEdit} className="cancel-btn">
                    Cancel
                </button>
                </div>
            ) : (
                // Normal view: text on left, buttons on right
                <>
                <span className="ingredient-text">{ingredient}</span>

                <div className="action-buttons">
                    <button
                    onClick={() => startEdit(index)}
                    className="edit-btn"
                    title="Edit this ingredient"
                    >
                    ✏️
                    </button>
                    <button
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                    title="Remove this ingredient"
                    >
                    🗑️
                    </button>
                </div>
                </>
            )}
            </li>
        ))}
        </ul>

      {/* Generate recipe button – only show if enough ingredients */}
      {ingredients.length > 3 && (
        <div className="get-recipe-container">
          <div ref={props.ref}>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button 
            onClick={getRecipe} 
            disabled={isLoading}
            className="get-recipe-btn"  // keep class if you have specific styles, but we'll override in CSS
          >
            {isLoading ? "Generating..." : "Get a recipe"}
          </button>
        </div>
      )}

      {/* NEW: Clear all button */}
      {ingredients.length > 0 && (
        <button
          onClick={clearAllIngredients}
          className="clear-all-btn"
          style={{
            marginTop: "1.5rem",
            backgroundColor: "#e74c3c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Clear All Ingredients
        </button>
      )}
    </section>
  );
}