import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Occupancy from '@/components/Occupancy';
import VideoStream from '@/components/VideoStream';
import Footer from '@/components/Footer';
import { getRole } from '@/lib/api/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [role, setRole] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [error, setError] = useState('');

  const cameraId = 'entrada1';

  useEffect(() => {
    getRole(token)
      .then(setRole)
      .catch(() => setError('No se pudo obtener el rol del usuario'));
  }, [token]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev: boolean) => !prev);
  };

  const canViewVideo = role === 'admin' || role === 'gestor';

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 space-y-6">
        <Navbar
          token={token}
          role={role}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={onLogout}
        />

        <main role="main">
          {error && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <Occupancy cameraId={cameraId} token={token} />

            {canViewVideo && <VideoStream cameraId={cameraId} token={token} />}

            {role && !canViewVideo && (
              <Alert>
                <AlertDescription>
                  La transmisión de video solo está disponible para usuarios con rol de administrador o gestor.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
