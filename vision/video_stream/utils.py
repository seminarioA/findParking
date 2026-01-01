# utils.py

def build_mjpeg_frame(jpeg_bytes: bytes) -> bytes:
    return (
        b'--frame\r\n'
        b'Content-Type: image/jpeg\r\n\r\n' +
        jpeg_bytes +
        b'\r\n'
    )
