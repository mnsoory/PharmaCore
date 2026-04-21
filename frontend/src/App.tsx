// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
// import LoginPage from "./pages/LoginPage";
// import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <div className="min-h-screen w-full bg-app-bg flex flex-col md:items-center md:justify-center overflow-auto p-0 md:p-8">
       <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;