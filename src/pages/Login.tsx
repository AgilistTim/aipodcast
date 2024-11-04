import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Link as NextLink } from '@nextui-org/react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/config');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('network-request-failed')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Failed to log in. Please check your credentials and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <Card className="p-6">
        <CardBody>
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="text-gray-400" size={20} />}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-gray-400" size={20} />}
              required
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <NextLink as={Link} to="/register" color="primary">
                Register here
              </NextLink>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;