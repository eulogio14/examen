import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/campus';
import { ApiError, getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import AuthShell from '../components/AuthShell';
import { esCorreoValido } from '../utils/validacion';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  function validar(): string | null {
    if (!name.trim() || name.trim().length > 100) {
      return 'El nombre debe tener entre 1 y 100 caracteres.';
    }
    if (!esCorreoValido(email)) {
      return 'Introduce un correo válido.';
    }
    if (password.length < 8 || password.length > 72) {
      return 'La contraseña debe tener entre 8 y 72 caracteres.';
    }
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError('');
    setEnviando(true);
    try {
      await authApi.register(name.trim(), email.trim(), password);
      navigate('/login', { replace: true });
    } catch (errorSubmit) {
      if (errorSubmit instanceof ApiError && errorSubmit.code === 'EMAIL_EXISTS') {
        setError('Ese correo ya está registrado.');
      } else if (errorSubmit instanceof ApiError && errorSubmit.status === 400) {
        setError('Revisa los datos introducidos.');
      } else {
        setError(getErrorMessage(errorSubmit));
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell
      titulo="Crear cuenta"
      descripcion="Regístrate para inscribirte en actividades."
      pie={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
            autoComplete="name"
            className={inputClass}
          />
        </label>
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
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className={inputClass}
          />
        </label>
        {error && <Alert mensaje={error} />}
        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  );
}
