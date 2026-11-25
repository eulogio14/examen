import { Link } from 'react-router-dom';
import type { Activity } from '../types/types';
import { formatearFecha } from '../utils/fechas';

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {activity.discipline}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{activity.name}</h2>
        </div>
        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {activity.vacancies} vacantes
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{formatearFecha(activity.date)}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
      <Link
        to={`/activities/${activity.id}`}
        className="mt-auto inline-flex pt-4 text-sm font-medium text-indigo-600 hover:underline"
      >
        Ver detalle →
      </Link>
    </article>
  );
}
