import React from 'react';
import { Descope } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate('/');
  };

  const onError = (error: any) => {
    console.error('Login error:', error);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Descope
        flowId="sign-up-or-in"
        onSuccess={onSuccess}
        onError={onError}
        theme={{
          primary: '#007bff'
        }}
      />
    </div>
  );
};

export default Login;
