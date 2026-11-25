import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/campus';
import { ApiError, getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/auth';
import { esCorreoValido } from '../utils/validacion';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!esCorreoValido(email) || !password) {
      setError('Introduce un correo válido y tu contraseña.');
      return;
    }

    setEnviando(true);
    try {
      const response = await authApi.login(email.trim(), password);
      login(response.token);
      const destino = (location.state as { from?: string } | null)?.from ?? '/activities';
      navigate(destino, { replace: true });
    } catch (errorSubmit) {
      if (errorSubmit instanceof ApiError && errorSubmit.code === 'UNAUTHORIZED') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(getErrorMessage(errorSubmit));
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell
      titulo="Iniciar sesión"
      descripcion="Accede para explorar las actividades culturales."
      pie={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </label>
        {error && <Alert mensaje={error} />}
        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {enviando ? 'Iniciando sesión…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  );
}
