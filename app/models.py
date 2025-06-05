from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# This will be initialized in app/__init__.py
db = SQLAlchemy()

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    technologies = db.Column(db.String(500))
    github_url = db.Column(db.String(300))
    live_url = db.Column(db.String(300))
    image_url = db.Column(db.String(300))
    featured = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f"Project('{self.title}')"
