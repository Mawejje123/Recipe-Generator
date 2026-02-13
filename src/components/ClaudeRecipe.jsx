// ClaudeRecipe.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Your hero image (change to your preferred one)
import heroImage from '../images/pasta-hero.jpg';

function ClaudeRecipe({ recipe, addToast }) {  // ← addToast prop from App.jsx
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // Check if already saved when recipe changes
  React.useEffect(() => {
    if (!recipe) return;

    try {
      const existing = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      const alreadySaved = existing.some(r => r.content === recipe);
      setSaved(alreadySaved);
    } catch (err) {
      console.error("Error reading savedRecipes:", err);
      setSaved(false);
    }
  }, [recipe]);

  // Improved title extraction
  const getRecipeTitle = () => {
    const markdown = typeof recipe === 'string' ? recipe : String(recipe || '');

    // Try h1 or h2 first
    const headingMatch = markdown.match(/^(#{1,2})\s+(.+)$/m);
    if (headingMatch && headingMatch[2]) {
      return headingMatch[2].trim();
    }

    // Fallback: first non-empty line
    const firstLine = markdown.split('\n').find(line => line.trim().length > 0);
    if (firstLine) {
      return firstLine.trim().replace(/^[-•*]/, '').trim();
    }

    return 'Your AI Recipe';
  };

  const recipeTitle = getRecipeTitle();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopied(true);
      addToast?.('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      addToast?.('Failed to copy', 'error');
    }
  };

  const handleSave = () => {
    if (saved) return;

    let title = 'Untitled Recipe';

    const markdown = typeof recipe === 'string' ? recipe : String(recipe || '');
    const match = markdown.match(/^(#{1,2})\s+(.+)$/m);
    if (match && match[2]) {
      title = match[2].trim();
    }

    const newEntry = {
      id: Date.now(),
      title,
      content: recipe,
      timestamp: new Date().toISOString(),
    };

    try {
      const current = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      if (!current.some(r => r.content === recipe)) {
        const updated = [...current, newEntry];
        localStorage.setItem('savedRecipes', JSON.stringify(updated));
        setSaved(true);
        addToast?.('Recipe saved!', 'success');
        console.log('Recipe saved:', newEntry);
      }
    } catch (err) {
      console.error('Save failed:', err);
      addToast?.('Failed to save recipe', 'error');
    }
  };

  const markdownContent = React.useMemo(() => {
    if (!recipe) return '';
    return typeof recipe === 'string' ? recipe : String(recipe);
  }, [recipe]);

  return (
    <div className="recipe-card">
      {/* Hero with image */}
      <div className="recipe-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <div className="title-container">
            <h1 className="recipe-title">{recipeTitle}</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="recipe-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: () => null, // hide duplicate title
            h2: ({ children }) => <h2 className="section-heading">{children}</h2>,
            h3: ({ children }) => <h3 className="section-subheading">{children}</h3>,
          }}
        >
          {markdownContent}
        </ReactMarkdown>

        {/* Action buttons */}
        <div className="recipe-actions">
          <button
            className={`save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saved}
            title={saved ? 'Already saved' : 'Save to favorites'}
          >
            {saved ? '❤️ Saved' : '♡ Save'}
          </button>

          <button
            className={`copy-recipe-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied! ✓' : 'Copy Recipe 📋'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaudeRecipe;