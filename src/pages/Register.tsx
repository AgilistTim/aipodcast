import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Link as NextLink } from '@nextui-org/react';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { Mail, Lock, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await register(email, password);
      navigate('/config');
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please use a different email or try logging in.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address. Please check and try again.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use a stronger password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection and try again.');
            break;
          default:
            setError('Failed to create an account. Please try again.');
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
          <div className="flex justify-center mb-6">
            <UserPlus size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
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
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startContent={<Lock className="text-gray-400" size={20} />}
              required
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
            >
              Register
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <NextLink as={Link} to="/login" color="primary">
                Login here
              </NextLink>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;