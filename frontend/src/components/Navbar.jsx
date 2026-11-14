import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Registrations', to: '/registrations' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-40 border-b border-white/[0.08] bg-[#0B0B14]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: QUEST Brand Mark */}
        <Link to="/" className="group flex items-center gap-3 focus:outline-none">
          <img
            src="/quest-logo.png"
            alt="QUEST Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-bold tracking-[0.16em] text-white">QUEST</span>
            <span className="font-mono-quest text-[9px] tracking-[0.22em] text-[#A879E6] uppercase">
              A Search Within
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'border border-[#A879E6]/40 bg-[#1A0F2E]/90 text-white shadow-[0_0_16px_rgba(130,68,179,0.28)]'
                    : 'border border-transparent text-[#CBD5E1] hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#1A0F2E]/70 text-[#CBD5E1] transition-colors hover:border-[#A879E6]/40 hover:text-white md:hidden"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="border-t border-white/[0.08] bg-[#0B0B14]/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border border-[#A879E6]/40 bg-[#1A0F2E] text-white'
                      : 'text-[#CBD5E1] hover:bg-white/[0.04] hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
