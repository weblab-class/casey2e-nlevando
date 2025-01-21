from flask import Flask, jsonify
from flask_cors import CORS
from Data_Collection import get_park_queue_times

app = Flask(__name__)
CORS(app)

@app.route('/api/queue-times')
def queue_times():
    try:
        # Islands of Adventure park ID is 64
        data = get_park_queue_times(64)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 