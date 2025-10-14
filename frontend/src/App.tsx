import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TitleBar } from './components/TitleBar';
import Home from './pages/Home';
import Transcripts from './pages/Transcripts';
import History from './pages/History';
import { VoiceNotesProvider } from './context/VoiceNotesContext';
import Layout from './components/Layout'; // Import Layout properly

function App() {
  return (
    <VoiceNotesProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
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
