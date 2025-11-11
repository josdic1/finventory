# app/__init__.py
from flask import Flask
from flask_cors import CORS
from .extensions import db, bcrypt, ma  
from .routes import bp

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    
    db.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    
    app.register_blueprint(bp, strict_slashes=False)
    
    return app