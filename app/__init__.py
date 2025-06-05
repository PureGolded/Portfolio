from flask import Flask
from flask_migrate import Migrate
from config import config
import os

migrate = Migrate()

def create_app(config_name='development'):
    # Get the absolute path to the project root
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    
    # Set template and static folders using absolute paths
    app = Flask(__name__, 
                template_folder=os.path.join(basedir, 'templates'),
                static_folder=os.path.join(basedir, 'static'))
    app.config.from_object(config[config_name])
    
    # Import db from models to avoid circular import
    from app.models import db
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints/routes
    from app.routes import main
    app.register_blueprint(main)
    
    return app
