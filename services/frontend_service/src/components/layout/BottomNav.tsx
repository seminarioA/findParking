import { Home, Settings, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-sm pb-safe"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex justify-around p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-1 w-full p-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-primary font-semibold"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
