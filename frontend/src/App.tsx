import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import History from './pages/History';

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
