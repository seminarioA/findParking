# app.py

from flask import Flask, render_template, Response, jsonify
from camera import processor  # Importa la instancia de VideoProcessor

app = Flask(__name__)

@app.route('/')
def user_view():
    # Vista para usuarios: muestra solo íconos
    return render_template('user_view.html')

@app.route('/admin')
def admin_view():
    # Vista para gestores: muestra stream de video y estado
    return render_template('admin_view.html')

@app.route('/video_feed')
def video_feed():
    # Endpoint de stream en tiempo real (multipart/x-mixed-replace)
    def gen():
        while True:
            frame = processor.get_frame()
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


# End - Point: RESTAPI
@app.route('/occupancy')
def get_occupancy():
    # Devuelve JSON con estado de ocupación por área y totales
    data = processor.get_occupancy()
    total = {
        "occupied": sum(1 for v in data.values() if v == 1),
        "free": sum(1 for v in data.values() if v == 0)
    }
    return jsonify({"areas": data, "summary": total})

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
