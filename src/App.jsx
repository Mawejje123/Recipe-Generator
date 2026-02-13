import { Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // ← required for toasts

import Header from './components/Header';
import Main from './components/Main';
import BottomNav from './components/BottomNav';
import SavedRecipes from './components/SavedRecipes';
import Search from './components/Search';
import Profile from './components/Profile'; // assuming this exists
import Toast from './components/Toast'; // ← import the Toast component

import './App.css';

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-wrapper">
      <Header />

      {/* Page content switches here */}
      <Routes>
        <Route path="/" element={<Main addToast={addToast} />} />
        <Route path="/recipes" element={<SavedRecipes addToast={addToast} />} />
        <Route path="/search" element={<Search addToast={addToast} />} />
        <Route path="/profile" element={<Profile addToast={addToast} />} />
      </Routes>

      <BottomNav />

      {/* Toast notifications – always visible on top-right */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;