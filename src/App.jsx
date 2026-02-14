import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Review from './pages/Review';

export default function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-zinc-900 text-zinc-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
