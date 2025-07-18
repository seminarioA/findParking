# app.py

from flask import Flask, render_template, Response, jsonify
from flask_login import login_required
from hpc_processor import processor_hpc
from redis_client import redis_manager
import threading
import time

app = Flask(__name__)

@app.route('/')
def user_view():
    # Vista para usuarios: muestra solo íconos
    return render_template('user_view.html')

@app.route('/admin')
@login_required
def admin_view():
    # Vista para gestores: muestra stream de video y estado
    return render_template('admin_view.html')


# Mejor stream: procesamiento HPC + cache Redis + threading
def stream_worker():
    while True:
        frame = processor_hpc.get_next_frame()
        if frame is not None:
            jpeg, occupancy = processor_hpc.process_parallel(frame)
            redis_manager.set_frame('latest_frame', jpeg)
            redis_manager.set_occupancy('latest_occupancy', occupancy)
        time.sleep(0.03)

stream_thread = threading.Thread(target=stream_worker, daemon=True)
stream_thread.start()




# End - Point: RESTAPI

@app.route('/occupancy')
def get_occupancy():
    data = redis_manager.get_occupancy('latest_occupancy')
    if not data:
        data = {f"area{i}": 0 for i in range(1, 13)}
    total = {
        "occupied": sum(1 for v in data.values() if v == 1),
        "free": sum(1 for v in data.values() if v == 0)
    }
    return jsonify({"areas": data, "summary": total})

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
