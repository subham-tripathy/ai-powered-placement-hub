from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# --- Endpoint 1: Resume Parsing ---
@app.route('/api/ai/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        print("No file provided")
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    text = ''

    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n'
    print(f"text: {text}")
    return jsonify({'text': text})

# --- Endpoint 2: Basic Keyword Ranking ---
@app.route('/api/ai/rank-by-keywords', methods=['POST'])
def rank_by_keywords():
    data = request.get_json()
    job_desc = data.get('job_description')
    resumes = data.get('resumes', [])

    if not job_desc or not resumes:
        return jsonify({'error': 'Missing job description or resumes'}), 400

    corpus = [job_desc] + [r['text'] for r in resumes]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Compute cosine similarity (job_desc vs each resume)
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Return ranking
    ranking = [{'id': resumes[i]['id'], 'score': float(similarities[i])} for i in range(len(resumes))]
    ranking.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(ranking)

@app.route('/')
def home():
    return "HELLO JI !"

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)
