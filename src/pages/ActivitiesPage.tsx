import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activitiesApi } from '../api/campus';
import ActivityCard from '../components/ActivityCard';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useRecurso } from '../hooks/useRecurso';

const SIZE = 5;

export default function ActivitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const solicitada = Number(searchParams.get('page') ?? '1');
  const page = Number.isInteger(solicitada) && solicitada > 0 ? solicitada : 1;
  const cargar = useCallback(() => activitiesApi.list(page, SIZE), [page]);
  const { data, cargando, error, recargar } = useRecurso(cargar, `activities-${page}`);

  function irAPagina(nuevaPagina: number) {
    const parametros = new URLSearchParams(searchParams);
    parametros.set('page', String(nuevaPagina));
    setSearchParams(parametros);
  }

  const totalPages = data?.totalPages ?? 0;
  const botonClass =
    'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Actividades culturales</h1>
          <p className="mt-1 text-sm text-slate-500">Explora el catálogo y elige tu próxima actividad.</p>
        </div>
        {data && <p className="text-sm text-slate-500">{data.totalItems} actividades disponibles</p>}
      </div>

      {cargando && <Loading texto="Cargando actividades…" />}
      {!cargando && error && <Alert mensaje={error} accion={{ texto: 'Reintentar', onClick: recargar }} />}
      {!cargando && !error && data?.items.length === 0 && (
        <EmptyState
          titulo="No hay actividades en esta página"
          descripcion="Vuelve a la primera página para ver el catálogo completo."
        />
      )}
      {!cargando && !error && data && data.items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => irAPagina(page - 1)}
          disabled={page <= 1 || cargando}
          className={botonClass}
        >
          Anterior
        </button>
        <span className="text-sm text-slate-600">
          Página {data?.page ?? page} de {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => irAPagina(page + 1)}
          disabled={cargando || (data !== null && page >= data.totalPages)}
          className={botonClass}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
