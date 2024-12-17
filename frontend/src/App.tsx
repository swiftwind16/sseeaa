import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import RequestForm from './pages/RequestForm';
import WarehouseList from './pages/WarehouseList';
import WarehouseDetail from './pages/WarehouseDetail';
import WarehousePriceDetail from './pages/WarehousePriceDetail';
import SearchHistory from './pages/SearchHistory';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/request" 
            element={
              <ProtectedRoute>
                <RequestForm />
              </ProtectedRoute>
            } 
          />
          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/warehouse/:location" element={<WarehouseDetail />} />
          <Route path="/warehouse/price/:id" element={<WarehousePriceDetail />} />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <SearchHistory />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 