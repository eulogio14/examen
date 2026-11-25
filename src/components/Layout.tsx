import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

function linkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
  }`;
}

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/activities" className="text-lg font-bold tracking-tight text-indigo-700">
            CampusCultura
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-3">
            <NavLink to="/activities" className={linkClass} end>
              Actividades
            </NavLink>
            <NavLink to="/me/enrollments" className={linkClass}>
              Mis inscripciones
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
