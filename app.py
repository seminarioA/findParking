# app.py

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def user_view():
    # Vista para usuarios: muestra solo íconos
    return render_template('user_view.html')

@app.route('/admin')
def admin_view():
    # Vista para gestores: muestra stream de video y estado
    return render_template('admin_view.html')

@app.route('/login')
def login_view():
    return render_template('login.html')

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
