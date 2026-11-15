import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';

// Common components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuestLoader from './components/QuestLoader';

// Pages
import Home from './pages/Home/Home';

function PlaceholderPage({ title }) {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center bg-[#0B0B14] px-4 pt-24 text-center text-white">
      <span className="font-mono-quest mb-3 rounded-full border border-white/10 bg-[#1A0F2E] px-4 py-1 text-xs tracking-[0.22em] text-[#A879E6] uppercase">
        QUEST · Module In Progress
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#CBD5E1]">
        This section is being crafted on a dedicated team branch. Return to the
        QUEST Home experience to explore the interactive 3D showcase.
      </p>
      <Link
        to="/"
        className="quest-btn-primary mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white"
      >
        Back to Home
      </Link>
    </section>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showLoader, setShowLoader] = useState(isHome);
  const [homeRevealed, setHomeRevealed] = useState(!isHome);

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLoader]);

  return (
    <>
      {showLoader && (
        <QuestLoader
          onRevealHome={() => setHomeRevealed(true)}
          onComplete={() => {
            setHomeRevealed(true);
            setShowLoader(false);
          }}
        />
      )}

      {/* Common Navbar */}
      <Navbar />

      {/* Page Routing */}
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home introReady={homeRevealed} />}
          />

          <Route path="/about" element={<PlaceholderPage title="About QUEST" />} />

          <Route path="/events" element={<PlaceholderPage title="Events" />} />

          <Route path="/gallery" element={<PlaceholderPage title="Gallery" />} />

          <Route path="/alumni" element={<PlaceholderPage title="Alumni" />} />

          <Route path="/registrations" element={<PlaceholderPage title="Registrations" />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={<PlaceholderPage title="404 — Page Not Found" />}
          />
        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </>
  );
}

export default App;
