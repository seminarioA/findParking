import type { OccupancyData } from '@/types/occupancy';

export async function getOccupancy(cameraId: string, token: string): Promise<OccupancyData> {
  const response = await fetch(`/api/occupancy/${cameraId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Error al obtener datos de ocupación');
  }

  return await response.json();
}
