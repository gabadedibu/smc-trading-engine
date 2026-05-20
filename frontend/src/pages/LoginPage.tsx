import { Navigate } from 'react-router-dom';
import { AuthCard } from '../components/Auth/AuthCard';
import { useAuthStore } from '../store/authStore';

export const LoginPage = (): JSX.Element => {
  const token = useAuthStore((state) => state.accessToken);
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthCard />
    </div>
  );
};
