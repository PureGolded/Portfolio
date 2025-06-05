from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/static/images/<filename>')
def serve_image(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
