
import { Routes, Route } from 'react-router-dom';

// Common components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Events from './pages/Events/Events';
import Gallery from './pages/Gallery/Gallery';
import Alumni from './pages/Alumni/Alumni';
import Registrations from './pages/Registrations/Registrations';

function App() {
  return (
    <>
      {/* Common Navbar */}
      <Navbar />

      {/* Page Routing */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/events" element={<Events />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/alumni" element={<Alumni />} />

          <Route path="/registrations" element={<Registrations />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={<h1>404 - Page Not Found</h1>}
          />
        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </>
  );
}

export default App;