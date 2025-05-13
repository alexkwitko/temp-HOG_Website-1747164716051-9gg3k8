import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../contexts/useAuth';

const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Helmet>
        <title>Create Account - House of Grappling</title>
      </Helmet>
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
        
        <RegisterForm />
        
        <div className="mt-6 text-center">
          <p className="text-text">
            Already have an account?{' '}
            <Link to="/login" className="text-text hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 