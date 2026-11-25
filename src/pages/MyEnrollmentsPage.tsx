import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsApi } from '../api/campus';
import { ApiError, getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import EnrollmentCard from '../components/EnrollmentCard';
import Loading from '../components/Loading';
import { useRecurso } from '../hooks/useRecurso';

export default function MyEnrollmentsPage() {
  const cargar = useCallback(() => enrollmentsApi.mine(), []);
  const { data, cargando, error, recargar } = useRecurso(cargar, 'mis-inscripciones');
  const [retirandoId, setRetirandoId] = useState<number | null>(null);
  const [errorAccion, setErrorAccion] = useState('');
  const [exito, setExito] = useState('');

  async function retirar(id: number) {
    setRetirandoId(id);
    setErrorAccion('');
    setExito('');
    try {
      await enrollmentsApi.withdraw(id);
      setExito('La inscripción se retiró correctamente.');
      recargar();
    } catch (errorRetirar) {
      if (errorRetirar instanceof ApiError && errorRetirar.code === 'INVALID_STATE') {
        setErrorAccion('La inscripción ya no está activa.');
        recargar();
      } else {
        setErrorAccion(getErrorMessage(errorRetirar));
      }
    } finally {
      setRetirandoId(null);
    }
  }

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mis inscripciones</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona las actividades en las que estás inscrito.</p>
      </div>

      {cargando && <Loading texto="Cargando inscripciones…" />}
      {!cargando && error && <Alert mensaje={error} accion={{ texto: 'Reintentar', onClick: recargar }} />}
      {errorAccion && <Alert mensaje={errorAccion} />}
      {exito && <Alert tipo="exito" mensaje={exito} />}

      {!cargando && !error && data?.length === 0 && (
        <EmptyState
          titulo="Todavía no tienes inscripciones"
          descripcion="Explora el catálogo e inscríbete en una actividad."
        />
      )}
      {!cargando && !error && data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((enrollment) => (
            <EnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              retirando={retirandoId === enrollment.id}
              onRetirar={retirar}
            />
          ))}
        </div>
      )}

      <Link
        to="/activities"
        className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Ver actividades
      </Link>
    </section>
  );
}
