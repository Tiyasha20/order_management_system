import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { getErrorMessage } from '../api/axiosInstance';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.includes('@')) nextErrors.email = 'Enter a valid email';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await loginRequest(form);
      login(data.token, data.user);
      toast.success('Logged in successfully');
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
        <h1>Logistics Portal</h1>
        <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button loading={loading} type="submit">Log in</Button>
        <p>New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </main>
  );
};
