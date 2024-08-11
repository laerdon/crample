from flask import Flask
from flask_cors import CORS
import os
import logging



def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    from backend.api.routes import api_blueprint
    app.register_blueprint(api_blueprint)

    return app