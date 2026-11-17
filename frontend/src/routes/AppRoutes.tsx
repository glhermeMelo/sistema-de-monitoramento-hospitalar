import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Pacientes } from '../pages/Pacientes';
import { PacienteDetalhes } from '../pages/PacienteDetalhes';
import { AppLayout } from '../components/AppLayout';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pacientes" element={<Pacientes />} />
                        <Route path="/pacientes/:id" element={<PacienteDetalhes />} />
                        <Route path="/leitos" element={<div className="text-slate-700">Leitos (em construção)</div>} />
                        <Route path="/alertas" element={<div className="text-slate-700">Alertas (em construção)</div>} />
                        <Route path="/usuarios" element={<div className="text-slate-700">Usuários (em construção)</div>} />
                        <Route path="/manutencao" element={<div className="text-slate-700">Manutenção / Sensores (em construção)</div>} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}