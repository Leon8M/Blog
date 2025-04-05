# Import necessary libraries and modules
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from models import db, BlogPost
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask import send_from_directory
import psycopg2 

load_dotenv()


# Initialize Flask app and configure CORS for secure cross-origin requests
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://blog-9k5.pages.dev"}},
     supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Configure database URI and upload folder for images
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
db.init_app(app)

# Load admin PIN from environment variables for authentication
ADMIN_PIN = os.getenv("ADMIN_PIN")
print(f"🔐 Admin PIN (Loaded from env): {ADMIN_PIN}")  # Debugging

if not ADMIN_PIN:
    raise ValueError("❌ ADMIN_PIN environment variable is missing!")

# Route to authenticate admin using PIN
@app.route("/api/admin/authenticate", methods=["POST"])
def authenticate_admin():
    data = request.json
    if data.get("password") == ADMIN_PIN:
        return jsonify({"authenticated": True})
    return jsonify({"authenticated": False}), 401

# Route to serve uploaded files (e.g., images)
@app.route('/static/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to fetch all blog posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([
        {'id': post.id, 'title': post.title, 'content': post.content, 'image_url': post.image_url,'medium_link': post.medium_link, 'date_posted': str(post.date_posted)}
        for post in posts
    ])

# Route to fetch a single blog post by ID
@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    return jsonify({'id': post.id, 'title': post.title, 'content': post.content, 'image_url': post.image_url,'medium_link': post.medium_link, 'date_posted': str(post.date_posted)})


# Route to create a new blog post
@app.route('/api/posts', methods=['POST'])
def create_post():
    title = request.form.get('title')
    content = request.form.get('content')
    medium_link = request.form.get('medium_link')
    image = request.files.get('image')
    
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    # Handle image upload if provided
    image_url = None
    if image:
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)
        image_url = f'https://blog-awpc.onrender.com/static/uploads/{filename}'
    
    new_post = BlogPost(title=title, content=content, image_url=image_url, medium_link=medium_link)
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify({'message': 'Post created successfully', 'id': new_post.id}), 201


# Route to update an existing blog post
@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    data = request.json
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    post.medium_link = data.get('medium_link', post.medium_link)
    db.session.commit()
    return jsonify({'message': 'Post updated successfully'})

# Route to delete a blog post and its associated image
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = BlogPost.query.get_or_404(post_id)

    # Delete the image file if it exists
    if post.image_url:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(post.image_url))
        if os.path.exists(image_path):
            os.remove(image_path)

    # Delete the post from the database
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({'message': 'Post and associated image deleted successfully'})

# Route to handle CORS preflight requests
@app.route('/api/posts/<int:post_id>', methods=['OPTIONS'])
def handle_preflight(post_id):
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "https://purple-pebble-05c780110.4.azurestaticapps.net"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Entry point for running the Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
