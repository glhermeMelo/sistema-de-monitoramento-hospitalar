import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { authService } from '../services/authService';

export function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({ login: login.trim(), senha });
            navigate('/dashboard');
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Não foi possível entrar. Verifique seu usuário e senha.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full">
            {/* Lado Esquerdo - Identidade Visual */}
            <div className="hidden w-1/2 flex-col items-center justify-center bg-[#071422] px-12 lg:flex">
                <div className="scale-125 transform transition-transform xl:scale-135">
                    <Logo variant="hero" />
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="flex w-full flex-col items-center justify-center bg-[#F8FAFC] px-8 py-16 lg:w-1/2">
                <div className="w-full max-w-lg">
                    <div className="mb-14 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            Bem-vindo(a) de volta!
                        </h2>
                        <p className="mt-4 text-base text-slate-500">
                            Acesse sua conta para continuar acompanhando e cuidando.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label
                                htmlFor="login"
                                className="mb-2.5 block text-base font-semibold text-slate-700"
                            >
                                Usuário
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#0E9F9E]" />
                                <input
                                    id="login"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder="Digite seu login de acesso"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:ring-2 focus:ring-[#0E9F9E]/20 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="senha"
                                className="mb-2.5 block text-base font-semibold text-slate-700"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#0E9F9E]" />
                                <input
                                    id="senha"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-12 pl-12 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:ring-2 focus:ring-[#0E9F9E]/20 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-3.5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        alert(
                                            'Entre em contato com o administrador do sistema para redefinir sua senha.'
                                        )
                                    }
                                    className="cursor-pointer text-sm font-medium text-[#0E9F9E] hover:underline"
                                >
                                    Esqueci minha senha
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-gradient flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl py-4 text-base font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}