// Header.jsx
import chefClaudeLogo from "../images/chef.png";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <img 
          src={chefClaudeLogo} 
          alt="Chef Claude Logo" 
          className="header-logo"
        />
        <h1 className="header-title">Chef Claude</h1>
      </div>
    </header>
  );
}