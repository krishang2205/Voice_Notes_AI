import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import Transcripts from './pages/Transcripts';
import { VoiceNotesProvider } from './context/VoiceNotesContext';

function App() {
  return (
    <VoiceNotesProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/transcripts" element={<Transcripts />} />
            <Route path="/tasks" element={<div className="p-8">Action Items (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VoiceNotesProvider>
  );
}

export default App;
