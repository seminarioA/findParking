// WebSocket MJPEG para video procesado u original
export function getVideoStream(cameraId: string, mode: 'processed' | 'original' = 'processed'): string {
  const endpoint = mode === 'original' ? 'raw' : 'processed';
  return `ws://${window.location.host}/api/video/${cameraId}/${endpoint}`;
}
