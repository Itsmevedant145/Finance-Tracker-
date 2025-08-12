from flask import Flask, request, jsonify

from nlp_processor import process_text

app = Flask(__name__)


@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    print("Received data:", data)  # 👈 Log here
    texts = data.get('texts', [])
    results = [process_text(text) for text in texts]
    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(port=5000)
