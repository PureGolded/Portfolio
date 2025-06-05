import os
from app import create_app
from app.models import db, Project

# Create application instance
app = create_app(os.getenv('FLASK_CONFIG') or 'development')

@app.shell_context_processor
def make_shell_context():
    """Make database models available in flask shell"""
    return dict(db=db, Project=Project)

@app.cli.command()
def init_db():
    """Initialize the database with sample data"""
    db.create_all()
    
    # Check if projects already exist
    if Project.query.count() == 0:
        # Create sample projects
        projects = [
            Project(
                title="Lunox Discord Bot",
                description="Advanced Python Discord bot with multiple features for community management and entertainment. Features include custom commands, database integration, and automated moderation.",
                technologies="Python, Discord.py, SQLite, Async Programming",
                github_url="https://github.com/PureGolded/Lunox",
                featured=True,
                order=1
            ),
            Project(
                title="Personal Server Infrastructure",
                description="Complete server setup with RAID configuration, Docker containers, and multiple self-hosted services running on haicome.net domain.",
                technologies="Linux Ubuntu, Docker, RAID Configuration, Networking, DNS Management",
                featured=True,
                order=2
            ),
            Project(
                title="Minecraft Server Network",
                description="Custom Java plugins developed using Spigot API to enhance multiplayer gameplay with custom game mechanics and player management.",
                technologies="Java, Spigot API, MySQL, Plugin Development",
                featured=True,
                order=3
            ),
            Project(
                title="Portfolio Website",
                description="Modern, responsive portfolio website built with Flask, featuring dark theme design, smooth animations, and content management system.",
                technologies="Python Flask, HTML/CSS/JS, SQLAlchemy, Responsive Design",
                featured=False,
                order=4
            )
        ]
        
        for project in projects:
            db.session.add(project)
    
    db.session.commit()
    print("Database initialized with sample data!")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
