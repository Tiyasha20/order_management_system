import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelOrder, listOrders } from '../api/orders';
import { getErrorMessage } from '../api/axiosInstance';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { Spinner } from '../components/Spinner';
import { Table } from '../components/Table';
import { useToast } from '../context/ToastContext';

export const Orders = () => {
  const [result, setResult] = useState({ data: [], page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const load = (page = 1) => {
    setLoading(true);
    listOrders({ page, limit: 10 })
      .then(setResult)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(1), []);

  const confirmCancel = async () => {
    try {
      await cancelOrder(selected._id);
      toast.success('Order cancelled');
      setSelected(null);
      load(result.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Spinner overlay />;

  return (
    <section>
      <div className="pageTitle"><h1>Orders</h1><Link className="btn primary" to="/orders/new">New order</Link></div>
      <Table
        headers={['Order ID', 'Route', 'Status', 'ETA', 'Actions']}
        rows={result.data.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.pickupAddress} to {order.deliveryAddress}</td>
            <td><Badge status={order.status} /></td>
            <td>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</td>
            <td className="rowActions">
              <Link to={`/orders/${order._id}`}>View</Link>
              {['PENDING', 'CONFIRMED'].includes(order.status) && <Button variant="danger" onClick={() => setSelected(order)}>Cancel</Button>}
            </td>
          </tr>
        ))}
      />
      <Pagination page={result.page} totalPages={result.totalPages} onPageChange={load} />
      {selected && <Modal title="Cancel order" message={`Cancel order ${selected._id}?`} onCancel={() => setSelected(null)} onConfirm={confirmCancel} />}
    </section>
  );
};
