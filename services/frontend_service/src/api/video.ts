// WebSocket MJPEG para video procesado
export function getVideoStream(cameraId: string): string {
  // Retorna la URL para el WebSocket
  return `ws://${window.location.host}/api/video/${cameraId}/processed`;
}
