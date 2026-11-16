import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Team', to: '/team' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Registrations', to: '/registrations', highlight: true },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [rippleCount, setRippleCount] = useState(0);

  function toggleMenu() {
    setIsOpen((open) => !open);
    setRippleCount((count) => count + 1);
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <header className={`site-header${isOpen ? ' is-menu-open' : ''}`}>
      <NavLink
        className="site-brand"
        to="/"
        aria-label="Quest home"
        onClick={() => setIsOpen(false)}
      >
        <img
          src={`${import.meta.env.BASE_URL}quest-logo.png`}
          alt="QUEST logo"
          className="site-brand__logo"
        />
        <span
          key={rippleCount}
          className={`site-brand__ripple${rippleCount > 0 ? ' is-active' : ''}`}
          aria-hidden="true"
        />
      </NavLink>

      <button
        className={`menu-toggle${isOpen ? ' is-open' : ''}`}
        type="button"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <span
        className={`menu-orb${isOpen ? ' is-open' : ''}`}
        aria-hidden="true"
      />

      <nav
        className={`site-nav${isOpen ? ' is-open' : ''}`}
        id="site-navigation"
        aria-label="Main navigation"
      >
        {links.map(({ label, to, highlight }) => (
          <NavLink
            className={({ isActive }) =>
              `site-nav-link${isActive ? ' is-active' : ''}${highlight ? ' site-nav-link--highlight' : ''}`
            }
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
          >
            {label}
            {highlight && (
              <svg
                className="site-nav-link__arrow"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8h9m-4-4 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;

