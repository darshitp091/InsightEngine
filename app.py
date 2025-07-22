from flask import Flask, render_template, request, jsonify, Response
import requests
from concurrent.futures import ThreadPoolExecutor
import json

app = Flask(__name__)

OLLAMA_API_BASE_URL = "http://localhost:11434/api"
DEFAULT_OLLAMA_MODEL = "gemma3n" # Fixed to gemma3n as per user request

# Create a thread pool executor for parallel Ollama calls
executor = ThreadPoolExecutor(max_workers=10)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_text():
    text = request.form['text']
    
    if not text.strip():
        return jsonify({"error": "Please provide text for analysis."}), 400

    # Define a single, comprehensive prompt for all analyses
    comprehensive_prompt = f"""Analyze the following text and provide the results in a JSON object with the following keys:
    - 'summary': A concise summary.
    - 'sentiment': The sentiment (positive, negative, or neutral) and a one-sentence explanation.
    - 'entities': Key entities (people, organizations, locations, concepts) listed on new lines.
    - 'executive_summary': A 1-2 sentence high-level overview.
    - 'technical_summary': A summary for a technical audience.
    - 'non_expert_summary': An explanation for someone with no prior knowledge.
    - 'bias_detection': Any potential bias or 'No obvious bias detected.'.
    - 'tweet': A concise, engaging tweet (under 280 characters).
    - 'blog_idea': A compelling blog post idea (title and 1-2 sentence description).
    - 'headline': A catchy and informative headline.
    - 'topics': Main topics as a comma-separated list.
    - 'language': The language of the text.
    - 'questions': Three questions the text could answer.

    Text: {text}

    JSON Response:"""

    def generate_events():
        try:
            # Make a single call to Ollama for all analyses
            full_response_str = call_ollama(comprehensive_prompt, DEFAULT_OLLAMA_MODEL)
            
            # Attempt to parse the JSON response
            try:
                # Remove markdown code block fences if present
                if full_response_str.startswith('```json') and full_response_str.endswith('```'):
                    full_response_str = full_response_str[7:-3].strip()
                elif full_response_str.startswith('```') and full_response_str.endswith('```'):
                    full_response_str = full_response_str[3:-3].strip()

                full_response_json = json.loads(full_response_str)
            except json.JSONDecodeError as e:
                # If JSON parsing fails, yield an error for each expected field
                error_message = f"Error parsing model response as JSON: {e}. Raw response: {full_response_str[:200]}..."
                for task_name in [
                    "summary", "sentiment", "entities", "executive_summary",
                    "technical_summary", "non_expert_summary", "bias_detection",
                    "tweet", "blog_idea", "headline", "topics", "language", "questions"
                ]:
                    yield f"event: {task_name}\ndata: {json.dumps(error_message)}\n\n"
                yield "event: complete\ndata: {}\n\n"
                return

            # Yield each analysis result as a separate event
            for task_name in full_response_json.keys():
                yield f"event: {task_name}\ndata: {json.dumps(full_response_json.get(task_name, 'N/A'))}\n\n"

        except Exception as e:
            # Catch any other errors during the single Ollama call
            error_msg = f"Error during comprehensive analysis: {e}"
            for task_name in [
                "summary", "sentiment", "entities", "executive_summary",
                "technical_summary", "non_expert_summary", "bias_detection",
                "tweet", "blog_idea", "headline", "topics", "language", "questions"
            ]:
                yield f"event: {task_name}\ndata: {json.dumps(error_msg)}\n\n"

        yield "event: complete\ndata: {}\n\n"

    return Response(generate_events(), mimetype='text/event-stream')

@app.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.get_json()
    text = data['text']
    question = data['question']

    if not text.strip() or not question.strip():
        return jsonify({"error": "Please provide both text and a question."}), 400

    qa_prompt = f'''Based on the following text, answer the question:
Text: {text}
Question: {question}
Answer:'''
    try:
        answer = call_ollama(qa_prompt, DEFAULT_OLLAMA_MODEL)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def call_ollama(prompt, model):
    try:
        response = requests.post(
            f"{OLLAMA_API_BASE_URL}/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            }
        )
        response.raise_for_status() # Raise an exception for HTTP errors
        return response.json()['response']
    except requests.exceptions.ConnectionError:
        raise Exception("Connection Error: Could not connect to the Ollama server. Please ensure it is running and accessible.")
    except requests.exceptions.Timeout:
        raise Exception("Timeout Error: The request to the Ollama server timed out. The server may be overloaded or the request too complex.")
    except requests.exceptions.RequestException as e:
        raise Exception(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    app.run(debug=True)
