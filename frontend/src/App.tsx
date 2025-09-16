import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/transcripts" element={<div className="p-8">Transcripts List (Coming Soon)</div>} />
          <Route path="/tasks" element={<div className="p-8">Action Items (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
