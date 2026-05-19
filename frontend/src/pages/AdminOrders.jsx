import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '../api/axiosInstance';
import { listOrders, updateOrderStatus } from '../api/orders';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Pagination } from '../components/Pagination';
import { Spinner } from '../components/Spinner';
import { Table } from '../components/Table';
import { useToast } from '../context/ToastContext';

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const nextStatus = { PENDING: ['CONFIRMED'], CONFIRMED: ['SHIPPED'], SHIPPED: ['DELIVERED'], DELIVERED: [], CANCELLED: [] };

export const AdminOrders = () => {
  const [result, setResult] = useState({ data: [], page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = (page = 1) => {
    setLoading(true);
    listOrders({ page, limit: 10, ...filters })
      .then(setResult)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(1), []);

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Status updated');
      load(result.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section>
      <h1>Admin orders</h1>
      <form className="toolbar" onSubmit={(e) => { e.preventDefault(); load(1); }}>
        <label className="field compact">
          <span>Status</span>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <Input label="Search by order ID" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <Button type="submit">Apply</Button>
      </form>
      {loading ? <Spinner overlay /> : (
        <>
          <Table
            headers={['Order ID', 'Customer', 'Route', 'Status', 'Update']}
            rows={result.data.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId?.name || 'Customer'}</td>
                <td>{order.pickupAddress} to {order.deliveryAddress}</td>
                <td><Badge status={order.status} /></td>
                <td>
                  <select value="" disabled={!nextStatus[order.status].length} onChange={(e) => changeStatus(order._id, e.target.value)}>
                    <option value="">Next status</option>
                    {nextStatus[order.status].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={load} />
        </>
      )}
    </section>
  );
};
