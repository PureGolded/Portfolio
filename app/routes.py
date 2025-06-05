"""
Main routes for the portfolio application.
"""

from flask import Blueprint, render_template, jsonify
from app.models import db, Project
import logging

# Create Blueprint
main = Blueprint('main', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@main.route('/')
def index():
    """Homepage with hero section and featured content."""
    try:
        # Get featured projects (limit to 3 for homepage)
        featured_projects = Project.query.filter_by(featured=True).limit(3).all()
        
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
        # Get all projects ordered by creation date
        projects = Project.query.order_by(Project.date_created.desc()).all()
        
        return render_template('projects.html', projects=projects)
    except Exception as e:
        logger.error(f"Error loading projects: {e}")
        return render_template('projects.html', projects=[])


@main.route('/about')
def about():
    """About page with detailed background."""
    return render_template('about.html')


@main.route('/contact')
def contact():
    """Contact page with contact information."""
    return render_template('contact.html')


@main.route('/api/projects/<int:project_id>')
def project_api(project_id):
    """API endpoint for project details (for modal/preview functionality)."""
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'technologies': project.technologies.split(',') if project.technologies else [],
            'github_url': project.github_url,
            'live_url': project.live_url,
            'image_url': project.image_url,
            'featured': project.featured
        })
    except Exception as e:
        logger.error(f"Error fetching project {project_id}: {e}")
        return jsonify({'error': 'Project not found'}), 404
