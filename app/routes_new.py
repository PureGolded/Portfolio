from flask import Blueprint, render_template, request
from app.models import Project

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """Main landing page with scrolling sections"""
    # Get featured projects for the homepage
    featured_projects = Project.query.filter_by(featured=True).order_by(Project.order).limit(3).all()
    return render_template('index.html', featured_projects=featured_projects)

@main.route('/projects')
def projects():
    """Project showcase page"""
    projects = Project.query.order_by(Project.order, Project.date_created.desc()).all()
    return render_template('projects.html', projects=projects)

@main.route('/about')
def about():
    """Detailed about page"""
    return render_template('about.html')

@main.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')

@main.route('/posts')
def posts():
    """Blog listing page"""
    page = request.args.get('page', 1, type=int)
    posts = Post.query.filter_by(published=True).order_by(Post.date_posted.desc()).paginate(
        page=page, per_page=5, error_out=False)
    return render_template('posts.html', posts=posts)
