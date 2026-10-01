import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./header/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import MyEventsPage from "./pages/MyEventPage";
import CreateEvent from "./pages/CreateEvent";
import EventDetailsPage from "./pages/EventDetailsPage";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactElement; 
}

function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (loading) {
    return null;
  }

  return (
  <>
    <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    <main className="app">
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/events" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/events" replace /> : <LoginPage onSubmit={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/events" replace /> : <RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/my-events" element={<ProtectedRoute isLoggedIn={isLoggedIn}><MyEventsPage /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CreateEvent /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </>
);
}

export default App;
