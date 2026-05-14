// leiloai-frontend/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <Auctions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/create"
          element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/:id"
          element={
            <ProtectedRoute>
              <AuctionDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/auctions" replace />} />
        <Route path="*" element={<Navigate to="/auctions" replace />} />
      </Routes>
    </>
  );
}