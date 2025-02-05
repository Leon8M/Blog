from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, BlogPost

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
db.init_app(app)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([{'id': post.id, 'title': post.title, 'content': post.content, 'date_posted': str(post.date_posted)} for post in posts])

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    return jsonify({'id': post.id, 'title': post.title, 'content': post.content, 'date_posted': str(post.date_posted)})

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    if not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400

    new_post = BlogPost(title=data['title'], content=data['content'])
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully', 'id': new_post.id}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
