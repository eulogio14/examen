import type { Enrollment } from '../types/types';
import { ETIQUETAS_ESTADO, ETIQUETAS_NIVEL } from '../utils/etiquetas';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  retirando: boolean;
  onRetirar: (id: number) => void;
}

export default function EnrollmentCard({ enrollment, retirando, onRetirar }: EnrollmentCardProps) {
  const activa = enrollment.status === 'ACTIVE';

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-900">{enrollment.resourceName}</h2>
        <p className="mt-1 text-sm text-slate-500">
          Nivel: {ETIQUETAS_NIVEL[enrollment.experienceLevel]}
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
            activa ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {ETIQUETAS_ESTADO[enrollment.status]}
        </span>
      </div>
      {activa && (
        <button
          type="button"
          onClick={() => onRetirar(enrollment.id)}
          disabled={retirando}
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {retirando ? 'Retirando…' : 'Retirar'}
        </button>
      )}
    </article>
  );
}
