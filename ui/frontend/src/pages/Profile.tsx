import { Camera, Edit, LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada correctamente');
  };

  const handleDeleteAccount = () => {
    logout();
    navigate('/login');
    toast.success('Cuenta eliminada correctamente');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Perfil" />

      <main className="p-4 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-28 w-28 border-2 border-primary">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary/20">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              aria-label="Cambiar foto de perfil"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-primary px-4">Información personal</h2>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Nombre</Label>
                  {editMode === 'name' ? (
                    <Input
                      defaultValue={user?.name}
                      className="mt-1"
                      onBlur={() => setEditMode(null)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-medium">{user?.name}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditMode('name')}
                  aria-label="Editar nombre"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Correo electrónico</Label>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <Button size="icon" variant="ghost" disabled aria-label="Editar correo">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Vehículo</Label>
                  {editMode === 'vehicle' ? (
                    <Input
                      defaultValue={user?.vehicle}
                      className="mt-1"
                      onBlur={() => setEditMode(null)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-medium">{user?.vehicle || 'No especificado'}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditMode('vehicle')}
                  aria-label="Editar vehículo"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-primary px-4">Configuración</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Notificaciones
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir alertas sobre disponibilidad
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="w-full gap-2"
            size="lg"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2" size="lg">
                <Trash2 className="h-4 w-4" />
                Eliminar cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus
                  datos de nuestra plataforma.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                  Eliminar cuenta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
