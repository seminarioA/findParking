import { Moon, Sun, LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserEmailFromToken } from '@/utils/jwt';

interface NavbarProps {
  token: string;
  role: string | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Navbar({ token, role, darkMode, onToggleDarkMode, onLogout }: NavbarProps) {
  const username = getUserEmailFromToken(token);

  return (
    <Card className="w-full" role="banner">
      <nav className="flex items-center justify-between flex-wrap gap-4 p-4" aria-label="Navegación principal">
        <h1 className="text-2xl font-bold tracking-wide">FindParking</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {role && (
            <Badge variant="secondary" className="gap-2 hidden sm:flex">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Rol:</span>
              {role.toUpperCase()}
            </Badge>
          )}

          <Badge variant="outline" className="gap-2 hidden md:flex">
            <User className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Usuario:</span>
            {username}
          </Badge>

          <Button
            onClick={onToggleDarkMode}
            variant="outline"
            size="icon"
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </Button>

          <Button
            onClick={onLogout}
            variant="outline"
            className="gap-2"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>
      </nav>
    </Card>
  );
}
