import { Volume2, Moon, Bell, Globe, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function Settings() {
  const [audioAccessibility, setAudioAccessibility] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Configuración" showBack />

      <main className="p-4 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-primary px-4">Accesibilidad</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="audio-accessibility" className="flex items-center gap-2 font-medium">
                    <Volume2 className="h-4 w-4" />
                    Accesibilidad auditiva
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activar o desactivar la accesibilidad auditiva
                  </p>
                </div>
                <Switch
                  id="audio-accessibility"
                  checked={audioAccessibility}
                  onCheckedChange={setAudioAccessibility}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-primary px-4">Visualización</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2 font-medium">
                    <Moon className="h-4 w-4" />
                    Modo oscuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre modo claro y modo oscuro
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-primary px-4">General</h2>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              <button className="flex items-center justify-between w-full p-4 text-left hover:bg-accent/50 transition-colors">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Bell className="h-4 w-4" />
                    Notificaciones
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configurar notificaciones
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-primary" />
              </button>

              <button className="flex items-center justify-between w-full p-4 text-left hover:bg-accent/50 transition-colors">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Seleccionar idioma
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-primary" />
              </button>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
