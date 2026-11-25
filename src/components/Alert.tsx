interface AlertProps {
  mensaje: string;
  tipo?: 'error' | 'exito';
  accion?: { texto: string; onClick: () => void };
}

export default function Alert({ mensaje, tipo = 'error', accion }: AlertProps) {
  const estilos = tipo === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-emerald-200 bg-emerald-50 text-emerald-800';

  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${estilos}`}
    >
      <span>{mensaje}</span>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="rounded-md border border-current px-2.5 py-1 font-medium hover:bg-white/60"
        >
          {accion.texto}
        </button>
      )}
    </div>
  );
}
