import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { getErrorMessage } from '../api/axiosInstance';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../context/ToastContext';

export const CreateOrder = () => {
  const [form, setForm] = useState({ pickupAddress: '', deliveryAddress: '', packageType: 'parcel', weight: '', estimatedDeliveryDate: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) nextErrors[key] = 'Required';
    });
    if (Number(form.weight) < 0.1) nextErrors.weight = 'Weight must be at least 0.1';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await createOrder({ ...form, weight: Number(form.weight) });
      toast.success('Order created');
      navigate('/orders');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Create order</h1>
      <form className="formGrid" onSubmit={submit}>
        <Input label="Pickup address" value={form.pickupAddress} error={errors.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} />
        <Input label="Delivery address" value={form.deliveryAddress} error={errors.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
        <label className="field">
          <span>Package type</span>
          <select value={form.packageType} onChange={(e) => setForm({ ...form, packageType: e.target.value })}>
            <option value="document">Document</option>
            <option value="parcel">Parcel</option>
            <option value="fragile">Fragile</option>
            <option value="heavy">Heavy</option>
          </select>
        </label>
        <Input label="Weight" type="number" min="0.1" step="0.1" value={form.weight} error={errors.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        <Input label="Estimated delivery date" type="date" value={form.estimatedDeliveryDate} error={errors.estimatedDeliveryDate} onChange={(e) => setForm({ ...form, estimatedDeliveryDate: e.target.value })} />
        <Button loading={loading} type="submit">Create order</Button>
      </form>
    </section>
  );
};
