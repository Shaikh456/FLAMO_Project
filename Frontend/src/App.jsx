import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage"; // Import the new Landing Page
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import HeirloomList from "./pages/Heirloom/HeirloomList";
import AddHeirloom from "./pages/Heirloom/AddHeirloom";
import EditHeirloom from "./pages/Heirloom/EditHeirloom";
import FamilySetup from "./pages/Family/FamilySetup";
import MemoriesPage from "./pages/memories/MemoriesPage";
import AddMemoryPage from "./pages/memories/AddMemoryPage";
import EditMemoryPage from "./pages/memories/EditMemoryPage";
import Settings from "./pages/settings/Settings";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: 20, background: "#0b0b0e", color: "white", height: "100vh" }}>Loading FLAMO...</div>;

  return (
    <BrowserRouter>
      <Routes>

        {/* 1. ROOT PATH -> LANDING PAGE (Public) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. AUTH ROUTES */}
        {/* If user is logged in, redirect away from auth pages to dashboard */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* 3. PROTECTED APP ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* Family Setup Logic */}
            <Route path="/family/setup" element={<FamilySetup />} />

            {/* Dashboard Redirect Logic */}
            <Route
              path="/dashboard"
              element={
                user?.family
                  ? <Dashboard />
                  : <Navigate to="/family/setup" />
              }
            />

            {/* Heirloom Routes */}
            <Route path="/heirlooms" element={<HeirloomList />} />
            <Route path="/heirlooms/add" element={<AddHeirloom />} />
            <Route path="/heirlooms/edit/:id" element={<EditHeirloom />} />

            {/* Memories Routes */}
            <Route path="memories" element={<MemoriesPage />} />
            <Route path="memories/add" element={<AddMemoryPage />} />
            <Route path="memories/edit/:id" element={<EditMemoryPage />} />

            {/* Settings */}
            <Route path="/settings" element={<Settings />} />

          </Route>
        </Route>

        {/* Catch-all: Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;