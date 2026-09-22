import Header from "./header/Header"; // Проверьте путь к Header, если он в папке header
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // Управляем тем, какая страница открыта: 'login' | 'register' | 'create-event'
  const [currentView, setCurrentView] = useState<"login" | "register" | "create-event">("login");

  const handleLogin = async (data: { email: string; password: string }) => {
    setUserEmail(data.email);
    setIsLoggedIn(true);
  };

  return (
    <>
      {/* Шапка должна быть СТРОГО внутри return компонента App */}
      <Header 
        onNavigate={(view) => setCurrentView(view)} 
      />
      
      <main className="app">
        {isLoggedIn ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "calc(100vh - 80px)",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: "#0f172a" }}>
              Вы успешно вошли в систему!
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "24px" }}>
              Добро пожаловать, {userEmail}
            </p>
            <button
              onClick={() => setIsLoggedIn(false)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </>
  );
}

export default App;