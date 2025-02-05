from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, BlogPost
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
db.init_app(app)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([
        {'id': post.id, 'title': post.title, 'content': post.content, 'image_url': post.image_url, 'date_posted': str(post.date_posted)}
        for post in posts
    ])

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    return jsonify({'id': post.id, 'title': post.title, 'content': post.content, 'image_url': post.image_url, 'date_posted': str(post.date_posted)})

@app.route('/api/posts', methods=['POST'])
def create_post():
    title = request.form.get('title')
    content = request.form.get('content')
    image = request.files.get('image')
    
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    image_url = None
    if image:
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)
        image_url = f'/static/uploads/{filename}'
    
    new_post = BlogPost(title=title, content=content, image_url=image_url)
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify({'message': 'Post created successfully', 'id': new_post.id}), 201

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    data = request.json
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()
    return jsonify({'message': 'Post updated successfully'})

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
