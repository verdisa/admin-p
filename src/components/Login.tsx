import React, { useState } from 'react';
import { loginWithCredentials } from '../utils-components/authUtils';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithCredentials(username, password);
      onLoginSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a202c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        backgroundColor: '#2d3748',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        border: '1px solid #4a5568'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src="/src/assets/solsol.png" 
            alt="Logo" 
            style={{
              height: '64px',
              width: 'auto',
              marginBottom: '16px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Iniciar Sesión
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#a0aec0',
            margin: '0'
          }}>
            Accede a tu sistema POS
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e2e8f0',
              marginBottom: '8px'
            }}>
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4a5568',
                border: '1px solid #718096',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Ingresa tu usuario"
              onFocus={(e) => e.target.style.borderColor = '#63b3ed'}
              onBlur={(e) => e.target.style.borderColor = '#718096'}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e2e8f0',
              marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4a5568',
                border: '1px solid #718096',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Ingresa tu contraseña"
              onFocus={(e) => e.target.style.borderColor = '#63b3ed'}
              onBlur={(e) => e.target.style.borderColor = '#718096'}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#742a2a',
              border: '1px solid #e53e3e',
              color: '#fed7d7',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#4a5568' : '#3182ce',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2c5282';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#3182ce';
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg 
                  style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                    height: '16px',
                    width: '16px'
                  }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    style={{ opacity: 0.25 }} 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    style={{ opacity: 0.75 }} 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default Login;
