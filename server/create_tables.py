from models import db
from flask import Flask
import os
import sqlalchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db.init_app(app)

with app.app_context():
    engine = db.engine
    inspector = sqlalchemy.inspect(engine)  # ✅ Use inspector

    if not inspector.has_table("blog_post"):  # ✅ Correct way to check if table exists
        db.create_all()
        print("✅ Tables created.")
    else:
        print("⚡ Tables already exist. Skipping creation.")
