import React from 'react';
import { Navigate, Outlet, Route, Routes, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminOrders } from './pages/AdminOrders';
import { CreateOrder } from './pages/CreateOrder';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { OrderDetail } from './pages/OrderDetail';
import { Orders } from './pages/Orders';
import { Signup } from './pages/Signup';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const CustomerRoute = () => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/orders" replace />;
  return <Outlet />;
};

const Layout = () => {
  const { user, isAdmin, logout } = useAuth();
  return (
    <div>
      <header className="topbar">
        <Link className="brand" to={isAdmin ? '/admin/orders' : '/dashboard'}>Logistics</Link>
        <nav>
          {!isAdmin && <Link to="/dashboard">Dashboard</Link>}
          {!isAdmin && <Link to="/orders">Orders</Link>}
          {isAdmin && <Link to="/admin/orders">Admin Orders</Link>}
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main className="container"><Outlet /></main>
    </div>
  );
};

export const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route element={<CustomerRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
