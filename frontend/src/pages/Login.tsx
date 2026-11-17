import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
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
            await authService.login({ login, senha });
            navigate('/dashboard');
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Não foi possível entrar. Verifique seu e-mail e senha.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full">
            {/* Lado Esquerdo - Identidade Visual */}
            <div className="hidden w-1/2 flex-col items-center justify-center bg-[#071422] px-12 lg:flex">
                <Logo variant="hero" />
            </div>

            {/* Lado Direito - Formulário */}
            <div className="flex w-full flex-col items-center justify-center bg-[#F8FAFC] px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Bem-vindo(a) de volta!
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Acesse sua conta para continuar acompanhando e cuidando.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="login"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0E9F9E]" />
                                <input
                                    id="login"
                                    type="text"
                                    required
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:ring-2 focus:ring-[#0E9F9E]/20 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="senha"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0E9F9E]" />
                                <input
                                    id="senha"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:ring-2 focus:ring-[#0E9F9E]/20 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-1.5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        alert('Entre em contato com o administrador do sistema para redefinir sua senha.')
                                    }
                                    className="text-xs font-medium text-[#0E9F9E] hover:underline"
                                >
                                    Esqueci minha senha
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-gradient flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}