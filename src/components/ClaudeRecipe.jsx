// ClaudeRecipe.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Your hero image
import heroImage from '../images/pasta-hero.jpg'; // or your pasta/food photo

function ClaudeRecipe({ recipe }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const markdownContent = React.useMemo(() => {
    if (!recipe) return '';
    if (typeof recipe === 'string') return recipe;
    if (Array.isArray(recipe)) return recipe.join('\n');
    return String(recipe);
  }, [recipe]);

  // Extract title for hero
  const titleMatch = markdownContent.match(/^#+\s*(.+)$/m);
  const recipeTitle = titleMatch ? titleMatch[1].trim() : 'Your AI Recipe';

  return (
    <div className="recipe-card">
      {/* Hero with image */}
      <div className="recipe-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <h1 className="recipe-title">{recipeTitle}</h1>
        </div>
      </div>

      {/* Content area – same dark background as ingredients */}
      <div className="recipe-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: () => null, // hide duplicate title
            h2: ({children}) => <h2 className="section-heading">{children}</h2>,
            h3: ({children}) => <h3 className="section-subheading">{children}</h3>,
          }}
        >
          {markdownContent}
        </ReactMarkdown>

        <button 
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'Copied! ✓' : 'Copy Recipe 📋'}
        </button>
      </div>
    </div>
  );
}

export default ClaudeRecipe;