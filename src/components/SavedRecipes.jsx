// src/components/SavedRecipes.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedRecipes(saved);
  }, []);

  const deleteRecipe = (id) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    setSavedRecipes(updated); // ← this triggers re-render so button disappears
  };

  return (
    <section className="saved-recipes-page">
      <h1 className="page-title">Saved Recipes ❤️</h1>

      {savedRecipes.length === 0 ? (
        <div className="empty-state">
          <h3>No saved recipes yet</h3>
          <p>Generate something delicious on the home page and save it here.</p>
        </div>
      ) : (
        <div className="saved-grid">
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} className="saved-card">
              <div className="saved-header">
                <h2 className="saved-title">{recipe.title || 'Untitled Recipe'}</h2>
                <span className="saved-date">
                  {new Date(recipe.timestamp).toLocaleDateString()}
                </span>
              </div>

              {recipe.ingredients?.length > 0 && (
                <div className="saved-ingredients">
                  <h4>Ingredients used:</h4>
                  <ul>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="saved-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {recipe.content}
                </ReactMarkdown>
              </div>

              {/* DELETE BUTTON – always visible here */}
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="delete-saved-btn"
              >
                🗑️ Delete Recipe
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}