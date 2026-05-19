import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders } from '../api/orders';
import { getErrorMessage } from '../api/axiosInstance';
import { Badge } from '../components/Badge';
import { Spinner } from '../components/Spinner';
import { Table } from '../components/Table';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    listOrders({ limit: 100 })
      .then((result) => setOrders(result.data))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'PENDING').length,
    delivered: orders.filter((order) => order.status === 'DELIVERED').length,
    cancelled: orders.filter((order) => order.status === 'CANCELLED').length
  };

  if (loading) return <Spinner overlay />;

  return (
    <section>
      <div className="pageTitle"><h1>Dashboard</h1><Link className="btn primary" to="/orders/new">New order</Link></div>
      <div className="stats">
        <div><strong>{counts.total}</strong><span>Total Orders</span></div>
        <div><strong>{counts.pending}</strong><span>Pending</span></div>
        <div><strong>{counts.delivered}</strong><span>Delivered</span></div>
        <div><strong>{counts.cancelled}</strong><span>Cancelled</span></div>
      </div>
      <h2>Recent orders</h2>
      <Table
        headers={['Order ID', 'Package', 'Status', 'ETA', '']}
        rows={orders.slice(0, 5).map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.packageType}</td>
            <td><Badge status={order.status} /></td>
            <td>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</td>
            <td><Link to={`/orders/${order._id}`}>Details</Link></td>
          </tr>
        ))}
      />
    </section>
  );
};
