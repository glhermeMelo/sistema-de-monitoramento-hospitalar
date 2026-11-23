import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Pacientes } from '../pages/Pacientes';
import { PacienteDetalhes } from '../pages/PacienteDetalhes';
import { Leitos } from '../pages/Leitos';
import { Usuarios } from '../pages/Usuarios';
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
                        <Route path="/leitos" element={<Leitos />} />
                        <Route path="/alertas" element={<div className="text-slate-700">Alertas (em construção)</div>} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/manutencao" element={<div className="text-slate-700">Manutenção / Sensores (em construção)</div>} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}