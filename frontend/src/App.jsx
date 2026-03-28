// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AdminRoute } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Pages
import Home from './pages/Home';
import Purchase from './pages/Purchase';
import Members from './pages/Members';
import HowItWorks from './pages/HowItWorks';
import Tournaments from './pages/Tournaments';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#312e2b] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen text-white">
      {children}
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/purchase" element={<PublicLayout><Purchase /></PublicLayout>} />
            <Route path="/members" element={<PublicLayout><Members /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/tournaments" element={<PublicLayout><Tournaments /></PublicLayout>} />

            <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}

export default App;
