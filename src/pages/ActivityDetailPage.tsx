import { useCallback, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { activitiesApi } from '../api/campus';
import { ApiError, getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useRecurso } from '../hooks/useRecurso';
import type { ExperienceLevel } from '../types/types';
import { formatearFecha } from '../utils/fechas';
import { ETIQUETAS_NIVEL, OPCIONES_NIVEL } from '../utils/etiquetas';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activityId = Number(id);
  const idValido = Number.isInteger(activityId) && activityId > 0 ? activityId : 0;
  const cargar = useCallback(() => activitiesApi.detail(idValido), [idValido]);
  const { data, cargando, error, recargar } = useRecurso(cargar, `activity-${idValido}`);
  const [nivel, setNivel] = useState<ExperienceLevel>('BEGINNER');
  const [enviando, setEnviando] = useState(false);
  const [errorInscripcion, setErrorInscripcion] = useState('');
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false);

  async function inscribirme(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorInscripcion('');
    setInscripcionExitosa(false);
    setEnviando(true);
    try {
      await activitiesApi.enroll(idValido, nivel);
      setInscripcionExitosa(true);
      recargar();
    } catch (errorInscribir) {
      if (errorInscribir instanceof ApiError && errorInscribir.code === 'ALREADY_ENROLLED') {
        setErrorInscripcion('Ya estás inscrito en esta actividad.');
      } else {
        setErrorInscripcion(getErrorMessage(errorInscribir));
      }
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return <Loading texto="Cargando actividad…" />;
  }

  if (error) {
    return <Alert mensaje={error} accion={{ texto: 'Reintentar', onClick: recargar }} />;
  }

  if (!data) {
    return <EmptyState titulo="Actividad no disponible" descripcion="No se pudo cargar la actividad." />;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <Link to="/activities" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Volver a actividades
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{data.discipline}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{data.name}</h1>
        <p className="mt-4 text-slate-600">{data.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Fecha</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{formatearFecha(data.date)}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Lugar</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{data.location}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Vacantes</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{data.vacancies}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={inscribirme} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Inscribirme</h2>
        <label className="block text-sm font-medium text-slate-700">
          Nivel de experiencia
          <select
            value={nivel}
            onChange={(event) => setNivel(event.target.value as ExperienceLevel)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {OPCIONES_NIVEL.map((opcion) => (
              <option key={opcion} value={opcion}>
                {ETIQUETAS_NIVEL[opcion]}
              </option>
            ))}
          </select>
        </label>
        {errorInscripcion && <Alert mensaje={errorInscripcion} />}
        {inscripcionExitosa && (
          <Alert
            tipo="exito"
            mensaje="Inscripción creada correctamente."
            accion={{ texto: 'Ver mis inscripciones', onClick: () => navigate('/me/enrollments') }}
          />
        )}
        {data.vacancies === 0 && (
          <p className="text-sm text-amber-700">No quedan vacantes disponibles en esta actividad.</p>
        )}
        <button
          type="submit"
          disabled={enviando || data.vacancies === 0}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {enviando ? 'Inscribiendo…' : 'Inscribirme'}
        </button>
      </form>
    </section>
  );
}
