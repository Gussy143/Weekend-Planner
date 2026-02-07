import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicView } from './routes/PublicView';
import { AdminLogin } from './routes/AdminLogin';
import { AdminDashboard } from './routes/AdminDashboard';
import { EventCreate } from './routes/EventCreate';
import { useThemeStore } from './store/useThemeStore';
import './styles/tokens.css';
import './styles/global.css';

const App: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  // Apply theme to document root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter basename="/">

      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/event/create" element={<EventCreate />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
