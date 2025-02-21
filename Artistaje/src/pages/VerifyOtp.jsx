// src/pages/VerifyOtp.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const { verifyOtp, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyOtp(email, otp);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Verificar Código</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Código de verificación
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}