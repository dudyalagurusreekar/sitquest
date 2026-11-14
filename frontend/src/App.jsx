import { Routes, Route } from 'react-router-dom';
import PresentTeam from './pages/About/PresentTeam';

function App() {
  return (
    <main>
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
  );
}

export default App;
