import type { ReactNode } from 'react';

interface AuthShellProps {
  titulo: string;
  descripcion: string;
  children: ReactNode;
  pie: ReactNode;
}

export default function AuthShell({ titulo, descripcion, children, pie }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">CampusCultura</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{titulo}</h1>
          <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
        </div>
        {children}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">{pie}</div>
      </div>
    </div>
  );
}
