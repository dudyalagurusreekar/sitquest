import { Routes, Route } from 'react-router-dom';
import PresentTeam from './pages/About/PresentTeam';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090912] text-white">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<PresentTeam />} />
          <Route path="/about" element={<PresentTeam />} />
          <Route path="/about/present-team" element={<PresentTeam />} />
          <Route path="/present-team" element={<PresentTeam />} />
          <Route path="/our-team" element={<PresentTeam />} />
          <Route path="/team" element={<PresentTeam />} />
          <Route path="*" element={<PresentTeam />} />
        </Routes>
      </main>

      {/* Shared QUEST Footer */}
      <Footer />
    </div>
  );
}

export default App;
