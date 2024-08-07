from . import api_blueprint
from flask import request, jsonify
from backend.services import openai_service, pinecone_service, scraping_service
from backend.utils.helper_functions import chunk_text, build_prompt

PINECONE_INDEX_NAME = 'crample'

@api_blueprint.route('/dirty-shortcut', methods=['POST'])
def dirty_shortcut(userInput):
    prompt = """You generate study plans. You will receive information from a user: what their test is on, when it is, how long they would like to study daily.
    You may or may not receive this information from a user: an outline of topics their exam will cover, and examples of practice problems.
    You will produce two pieces of text. PART 1: Produce a study plan outlining which topics will be covered.
    Reference practice problems which you have generated in part 2.
    PART 2: Produce a worksheet of practice problems based on the input that you have been provided.
    Do not produce any extraneous text besides these two items. Here is the user-provided information: """ + userInput
    
    answer = openai_service.get_llm_answer(prompt)
    return answer

@api_blueprint.route('/handle-query', methods=['POST'])
def handle_query():
    question = request.json['question']
    context_chunks = pinecone_service.get_most_similar_chunks_for_query(question, PINECONE_INDEX_NAME)
    prompt = build_prompt(question, context_chunks)
    print("\n==== PROMPT ====\n")
    print(prompt)
    answer = openai_service.get_llm_answer(prompt)
    return jsonify({ "question": question, "answer": answer })    


@api_blueprint.route('/embed-and-store', methods=['POST'])
def embed_and_store():
    url = request.json['url']
    url_text = scraping_service.scrape_website(url)
    chunks = chunk_text(url_text)
    pinecone_service.embed_chunks_and_upload_to_pinecone(chunks, PINECONE_INDEX_NAME)
    response_json = {
        "message": "Chunks embedded and stored successfully"
    }
    return jsonify(response_json)

@api_blueprint.route('/delete-index', methods=['POST'])
def delete_index():
    pinecone_service.delete_index(PINECONE_INDEX_NAME)
    return jsonify({"message": f"Index {PINECONE_INDEX_NAME} deleted successfully"})