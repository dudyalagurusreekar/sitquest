import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Common components
import * as NavbarMod from './components/Navbar';
import * as FooterMod from './components/Footer';
import QuestLoader from './components/QuestLoader';

// Pages
import Home from './pages/Home/Home';
import * as AboutMod from './pages/About/About';
import * as EventsMod from './pages/Events/Events';
import * as GalleryMod from './pages/Gallery/Gallery';
import * as AlumniMod from './pages/Alumni/Alumni';
import * as RegistrationsMod from './pages/Registrations/Registrations';

const Navbar = NavbarMod['default'];
const Footer = FooterMod['default'];
const About = AboutMod['default'];
const Events = EventsMod['default'];
const Gallery = GalleryMod['default'];
const Alumni = AlumniMod['default'];
const Registrations = RegistrationsMod['default'];

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
      {Navbar ? <Navbar /> : null}

      {/* Page Routing */}
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home introReady={homeRevealed} />}
          />

          <Route path="/about" element={About ? <About /> : null} />

          <Route path="/events" element={Events ? <Events /> : null} />

          <Route path="/gallery" element={Gallery ? <Gallery /> : null} />

          <Route path="/alumni" element={Alumni ? <Alumni /> : null} />

          <Route path="/registrations" element={Registrations ? <Registrations /> : null} />

          {/* 404 Page */}
          <Route
            path="*"
            element={<h1>404 - Page Not Found</h1>}
          />
        </Routes>
      </main>

      {/* Common Footer */}
      {Footer ? <Footer /> : null}
    </>
  );
}

export default App;
