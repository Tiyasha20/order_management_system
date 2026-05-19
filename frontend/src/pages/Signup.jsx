import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupRequest } from '../api/auth';
import { getErrorMessage } from '../api/axiosInstance';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'customer', adminKey: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.includes('@')) nextErrors.email = 'Enter a valid email';
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords must match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await signupRequest(form);
      login(data.token, data.user);
      toast.success('Account created');
      navigate(data.user.role === 'admin' ? '/admin/orders' : '/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authShell">
      <form className="authPanel" onSubmit={submit}>
        <h1>Create account</h1>
        <Input label="Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Input label="Confirm password" type="password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <label className="field">
          <span>Role</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {form.role === 'admin' && <Input label="Admin signup key" value={form.adminKey} onChange={(e) => setForm({ ...form, adminKey: e.target.value })} />}
        <Button loading={loading} type="submit">Sign up</Button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
};
