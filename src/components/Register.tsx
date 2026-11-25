import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/campus';
import { ApiError } from '../api/client';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await authApi.register(name, email, password);   // ⚠️ name, email, password
      navigate('/login', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_EXISTS')
        setError('Ese correo ya está registrado.');
      else if (err instanceof ApiError && err.status === 400)
        setError('Revisa los campos (contraseña 8–72, correo válido).');
      else if (err instanceof ApiError) setError(err.message);
      else setError('Error de red.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-slate-900">Crear cuenta</h1>

        <label className="block text-sm font-medium text-slate-700">
          Nombre
          <input value={name} onChange={e => setName(e.target.value)} required maxLength={100}
                 className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Correo
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254}
                 className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Contraseña <span className="font-normal text-slate-400">(8–72)</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                 required minLength={8} maxLength={72}
                 className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </label>

        {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        <button type="submit" disabled={enviando}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300">
          {enviando ? 'Creando…' : 'Crear cuenta'}
        </button>
        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}