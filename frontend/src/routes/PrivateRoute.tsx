import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export function PrivateRoute() {
    return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}