// API para ocupación
export async function getOccupancy(cameraId: string, token: string) {
  const res = await fetch(`/api/occupancy/${cameraId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error obteniendo ocupación');
  return await res.json();
}
