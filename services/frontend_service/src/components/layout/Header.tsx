import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showAdmin?: boolean;
}

export default function Header({ title, subtitle, showBack = false, showAdmin = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Volver atrás"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm font-semibold text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {showAdmin && user?.role === 'admin' ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            aria-label="Panel de administración"
          >
            <Shield className="h-5 w-5 text-primary" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
}
