// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';

export default function Profile({ addToast }) {
  const [userName, setUserName] = useState('Chef Eli');
  const [bio, setBio] = useState('Passionate home cook exploring AI-generated recipes in Kampala 🍲');
  const [favoriteCuisine, setFavoriteCuisine] = useState('Ugandan Fusion');
  const [profilePhoto, setProfilePhoto] = useState(null); // base64 string
  const [dietaryPrefs, setDietaryPrefs] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    nutAllergy: false,
    lactoseIntolerant: false,
    halal: false,
    kosher: false,
    lowCarb: false,
    keto: false,
    diabeticFriendly: false,
    lowSodium: false,
    paleo: false,
    soyFree: false,
    shellfishAllergy: false,
    eggAllergy: false,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load saved profile
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.name) setUserName(savedProfile.name);
    if (savedProfile.bio) setBio(savedProfile.bio);
    if (savedProfile.favoriteCuisine) setFavoriteCuisine(savedProfile.favoriteCuisine);
    if (savedProfile.profilePhoto) setProfilePhoto(savedProfile.profilePhoto);
    if (savedProfile.dietaryPrefs) setDietaryPrefs(savedProfile.dietaryPrefs);
    if (savedProfile.theme) {
      setTheme(savedProfile.theme);
      document.documentElement.classList.toggle('light-mode', savedProfile.theme === 'light');
    }

    // Load recent recipes
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setRecentRecipes(saved.slice(0, 5));
  }, []);

  const saveProfile = () => {
    const profile = {
      name: userName,
      bio,
      favoriteCuisine,
      profilePhoto,
      dietaryPrefs,
      theme,
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    addToast?.('Profile saved!', 'success');
  };

  // Resize & crop photo to square (max 300×300)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 300; // target size
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        // Center crop
        const aspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (aspect > 1) {
          // wider than tall
          drawHeight = size;
          drawWidth = size * aspect;
          offsetX = (size - drawWidth) / 2;
          offsetY = 0;
        } else {
          // taller than wide
          drawWidth = size;
          drawHeight = size / aspect;
          offsetX = 0;
          offsetY = (size - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        setProfilePhoto(canvas.toDataURL('image/jpeg', 0.85)); // quality 85%
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleDietPref = (key) => {
    setDietaryPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-mode', newTheme === 'light');
    addToast?.(`Switched to ${newTheme} mode`, 'info');
  };

  const clearAllData = () => {
    if (window.confirm('This will delete your profile, saved recipes, and all preferences. Are you sure?')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('savedRecipes');
      setUserName('Chef Eli');
      setBio('Passionate home cook...');
      setFavoriteCuisine('Ugandan Fusion');
      setProfilePhoto(null);
      setDietaryPrefs({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        nutAllergy: false,
        lactoseIntolerant: false,
        halal: false,
        kosher: false,
        lowCarb: false,
        keto: false,
        diabeticFriendly: false,
        lowSodium: false,
        paleo: false,
        soyFree: false,
        shellfishAllergy: false,
        eggAllergy: false,
      });
      setRecentRecipes([]);
      setTheme('dark');
      document.documentElement.classList.remove('light-mode');
      addToast?.('All data cleared', 'info');
    }
  };

  return (
    <section className="profile-page">
      <h1 className="page-title">Your Profile 👨🏾‍🍳</h1>

      <div className="profile-card">
        <div className="profile-avatar">
  {profilePhoto ? (
    <img src={profilePhoto} alt="Profile" className="profile-photo" />
  ) : (
    <div className="avatar-placeholder">
      {userName.charAt(0).toUpperCase()}
    </div>
  )}

  {/* Upload label moved below */}
  <label className="photo-upload-label">
    <span>Upload / Change Photo</span>
    <input
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
      hidden
    />
  </label>
</div>

        <div className="profile-info">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            className="profile-input name-input"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself or your cooking style..."
            className="profile-input bio-input"
            rows={3}
          />

          <input
            type="text"
            value={favoriteCuisine}
            onChange={(e) => setFavoriteCuisine(e.target.value)}
            placeholder="Favorite cuisine (e.g. Ugandan Fusion)"
            className="profile-input"
          />
        </div>

        {/* Dietary Preferences */}
        <div className="dietary-section">
          <h3>Dietary Preferences & Allergies</h3>
          <div className="toggle-grid">
            {Object.entries(dietaryPrefs).map(([key, value]) => (
              <label key={key} className="toggle-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleDietPref(key)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle">
          <label>
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            Light Mode
          </label>
        </div>

        {/* Actions */}
        <button onClick={saveProfile} className="save-profile-btn">
          Save Profile
        </button>

        <button onClick={clearAllData} className="clear-data-btn">
          Logout / Clear All Data
        </button>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity (Last 5)</h2>
        {recentRecipes.length === 0 ? (
          <p>No recent activity yet. Save some recipes!</p>
        ) : (
          <div className="recent-grid">
            {recentRecipes.map(r => (
              <div key={r.id} className="recent-item">
                <h3>{r.title || 'Untitled Recipe'}</h3>
                <small>{new Date(r.timestamp).toLocaleDateString()}</small>
                <p>{r.content.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}