import { useState } from "react";
import Header, { type View } from "./header/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import MyEventsPage from "./pages/MyEventPage";
import CreateEvent from "./pages/CreateEvent";

const PROTECTED_VIEWS: View[] = ["my-events", "create-event"];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>("events");
  const [afterLoginView, setAfterLoginView] = useState<View | null>(null);

  const navigate = (view: View) => {
    if (!isLoggedIn && PROTECTED_VIEWS.includes(view)) {
      setAfterLoginView(view);
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
  };

  const handleLogin = async () => {
    setIsLoggedIn(true);
    setCurrentView(afterLoginView ?? "events");
    setAfterLoginView(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAfterLoginView(null);
    setCurrentView("events");
  };

  return (
    <>
      <Header
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <main className="app">
        {currentView === "login" && (
          <LoginPage
            onSubmit={handleLogin}
            onNavigateToRegister={() => setCurrentView("register")}
          />
        )}

        {currentView === "register" && (
          <RegisterPage
            onSubmit={(data) => {
              alert(`Аккаунт ${data.email} успешно создан!`);
              setCurrentView("login");
            }}
            onNavigateToLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "events" && <EventsPage />}

        {currentView === "my-events" && isLoggedIn && (
          <MyEventsPage
            onCreateEvent={() => navigate("create-event")}
            onBrowseEvents={() => navigate("events")}
          />
        )}

        {currentView === "create-event" && isLoggedIn && <CreateEvent />}
      </main>
    </>
  );
}

export default App;