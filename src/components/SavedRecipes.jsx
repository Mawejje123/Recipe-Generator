// SavedRecipes.jsx
import { useState, useEffect } from 'react';

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setRecipes(saved);
  }, []);

  return (
    <div>
      <h2>Your Saved Recipes 🍲</h2>
      {recipes.length === 0 ? (
        <p>No saved recipes yet — generate some tasty ones!</p>
      ) : (
        recipes.map(r => (
          <div key={r.id} style={{ border: '1px solid #444', margin: '1rem 0', padding: '1rem', borderRadius: '8px' }}>
            <h3>{r.title}</h3>
            <small>{new Date(r.timestamp).toLocaleDateString()}</small>
            <div dangerouslySetInnerHTML={{ __html: marked.parse(r.content) }} />
          </div>
        ))
      )}
    </div>
  );
}