// src/components/Search.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Search({ addToast }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [expandedCards, setExpandedCards] = useState({}); // track which cards are expanded

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedRecipes(saved);
    setFilteredRecipes(saved);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecipes(savedRecipes);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = savedRecipes.filter(recipe => {
      const titleMatch = recipe.title?.toLowerCase().includes(term);
      const contentMatch = recipe.content?.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients?.some(ing => ing.toLowerCase().includes(term));
      return titleMatch || contentMatch || ingredientMatch;
    });

    setFilteredRecipes(results);
  }, [searchTerm, savedRecipes]);

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <section className="search-page">
      <h1 className="page-title">Search Saved Recipes 🔍</h1>

      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search by title, ingredient, or recipe content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={clearSearch} className="clear-search-btn">
            ✕
          </button>
        )}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <h3>No matches found</h3>
              <p>Try different keywords or clear the search.</p>
            </>
          ) : (
            <>
              <h3>No saved recipes yet</h3>
              <p>Save some recipes from the home page first!</p>
            </>
          )}
        </div>
      ) : (
        <div className="search-results-grid">
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedCards[recipe.id] || false;
            const previewLength = 400;
            const isLong = recipe.content.length > previewLength;

            return (
              <div 
                key={recipe.id} 
                className="saved-card"
                onClick={() => isLong && toggleExpand(recipe.id)} // tap anywhere on card to toggle
                style={{ cursor: isLong ? 'pointer' : 'default' }}
              >
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
                    {isExpanded || !isLong
                      ? recipe.content
                      : recipe.content.slice(0, previewLength) + '...'}
                  </ReactMarkdown>

                  {isLong && (
                    <div className="read-more-wrapper">
                      <button
                        className="read-more-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click from triggering again
                          toggleExpand(recipe.id);
                        }}
                      >
                        {isExpanded ? 'Read less ↑' : 'Tap / scroll to view full recipe ↓'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}