import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Main from './components/Main'              // ← your current home content
import BottomNav from './components/BottomNav'
import SavedRecipes from './components/SavedRecipes'   // we'll create these next
import Search from './components/Search'
import Profile from './components/Profile'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <Header />

      {/* This is where pages switch */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/recipes" element={<SavedRecipes />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <BottomNav />
    </div>
  )
}

export default App