from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    medium_link = db.Column(db.String(255), nullable=True)
    date_posted = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f"BlogPost('{self.title}', '{self.date_posted}')"
