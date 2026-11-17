import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Home,
    Users,
    BedDouble,
    Bell,
    UserCog,
    Wrench,
    LogOut,
} from 'lucide-react';
import { Logo } from './Logo';
import { authService } from '../services/authService';

const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/pacientes', label: 'Pacientes', icon: Users },
    { to: '/leitos', label: 'Leitos', icon: BedDouble },
    { to: '/alertas', label: 'Alertas', icon: Bell },
    { to: '/usuarios', label: 'Usuários', icon: UserCog },
    { to: '/manutencao', label: 'Manutenção', icon: Wrench },
];

export function AppLayout() {
    const navigate = useNavigate();

    function handleLogout() {
        authService.logout();
        navigate('/login');
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="flex w-60 shrink-0 flex-col justify-between bg-[#071422] px-4 py-6 text-slate-300">
                <div>
                    <div className="mb-8 px-2">
                        <Logo variant="sidebar" />
                    </div>

                    <nav className="space-y-1.5">
                        {menuItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                                        isActive
                                            ? 'border-l-4 border-[#0E9F9E] bg-gradient-to-r from-[#0E9F9E]/30 to-transparent text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                </button>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex flex-1 flex-col">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-end gap-5 border-b border-slate-100 bg-white px-8">
                    <button
                        onClick={() => navigate('/alertas')}
                        className="relative cursor-pointer rounded-full p-2 text-slate-600 hover:bg-slate-100"
                        title="Notificações"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              3
            </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E9F9E]/15 text-sm font-bold text-[#0E9F9E]">
                            SM
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-slate-800">Usuário Logado</p>
                            <p className="text-xs text-slate-400">Equipe Hospitalar</p>
                        </div>
                    </div>
                </header>

                {/* Área Dinâmica das Páginas */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}