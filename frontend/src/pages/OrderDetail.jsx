import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axiosInstance';
import { getOrder } from '../api/orders';
import { Badge } from '../components/Badge';
import { Spinner } from '../components/Spinner';
import { useToast } from '../context/ToastContext';

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner overlay />;
  if (!order) return <p>Order not found.</p>;

  return (
    <section>
      <h1>Order detail</h1>
      <div className="detailGrid">
        <div><span>Order ID</span><strong>{order._id}</strong></div>
        <div><span>Status</span><Badge status={order.status} /></div>
        <div><span>Pickup</span><strong>{order.pickupAddress}</strong></div>
        <div><span>Delivery</span><strong>{order.deliveryAddress}</strong></div>
        <div><span>Package</span><strong>{order.packageType}</strong></div>
        <div><span>Weight</span><strong>{order.weight} kg</strong></div>
        <div><span>ETA</span><strong>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</strong></div>
        <div><span>Created</span><strong>{new Date(order.createdAt).toLocaleString()}</strong></div>
        <div><span>Updated</span><strong>{new Date(order.updatedAt).toLocaleString()}</strong></div>
      </div>
    </section>
  );
};
