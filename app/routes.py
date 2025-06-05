"""
Main routes for the portfolio application.
"""

from flask import Blueprint, render_template, jsonify, current_app
import json
import os
import random
import logging

# Create Blueprint
main = Blueprint('main', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_projects():
    """Load projects from JSON file."""
    try:
        projects_file = os.path.join(current_app.static_folder, 'data', 'projects.json')
        with open(projects_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('projects', [])
    except Exception as e:
        logger.error(f"Error loading projects from JSON: {e}")
        return []


@main.route('/')
def index():
    """Homepage with hero section and featured content."""
    try:
        # Load all projects
        all_projects = load_projects()
        
        # Always include Haicome project
        haicome_project = next((p for p in all_projects if p.get('featured', False)), None)
        
        # Get other non-featured projects and randomly select 2
        other_projects = [p for p in all_projects if not p.get('featured', False)]
        random_projects = random.sample(other_projects, min(2, len(other_projects)))
        
        # Combine featured project with random selection
        featured_projects = [haicome_project] + random_projects if haicome_project else random_projects[:3]
        
        return render_template('index.html', 
                             featured_projects=featured_projects)
    except Exception as e:
        logger.error(f"Error loading homepage: {e}")
        return render_template('index.html', 
                             featured_projects=[])


@main.route('/projects')
def projects():
    """Projects showcase page."""
    try:
        # Load all projects
        all_projects = load_projects()
        
        # Get featured project (Haicome)
        featured_project = next((p for p in all_projects if p.get('featured', False)), None)
        
        return render_template('projects.html', projects=all_projects, featured_project=featured_project)
    except Exception as e:
        logger.error(f"Error loading projects: {e}")
        return render_template('projects.html', projects=[], featured_project=None)


@main.route('/about')
def about():
    """About page with detailed background."""
    return render_template('about.html')


@main.route('/contact')
def contact():
    """Contact page with contact information."""
    return render_template('contact.html')
