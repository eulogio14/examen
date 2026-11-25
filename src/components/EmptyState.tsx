interface EmptyStateProps {
  titulo: string;
  descripcion: string;
}

export default function EmptyState({ titulo, descripcion }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
      <p className="font-medium text-slate-800">{titulo}</p>
      <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
    </div>
  );
}
