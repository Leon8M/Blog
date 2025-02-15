from models import db
from flask import Flask
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db.init_app(app)

with app.app_context():
    # Check if table exists
    engine = db.engine
    if not engine.dialect.has_table(engine, "blog_post"):  # ✅ Only create if it doesn't exist
        db.create_all()
        print("✅ Tables created.")
    else:
        print("⚡ Tables already exist. Skipping creation.")
