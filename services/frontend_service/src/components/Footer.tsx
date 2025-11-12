import { Card, CardContent } from '@/components/ui/card';

export default function Footer() {
  return (
    <Card className="w-full mt-8" role="contentinfo">
      <CardContent className="p-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground">
          Demo para la Universidad Tecnológica del Perú (UTP)
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} FindParking. Sistema de monitoreo de estacionamiento inteligente.
        </p>
      </CardContent>
    </Card>
  );
}
