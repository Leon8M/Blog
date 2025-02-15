# 📝 The Nex Journal
The Nex Journal is a modern blogging platform that allows users to create, update, and delete blog posts. It features an admin panel for managing content and integrates with a PostgreSQL database hosted on Render.

## 🌟 Features
🖊️ Create, Read, Update, Delete (CRUD) Blog Posts
🖼️ Upload Images for Blog Posts
🔗 Support for External Medium Links
🔒 Admin Authentication for Secure Access
🌍 Deployed on Render (Backend) and Azure Static Web Apps (Frontend)
🗄️ Uses PostgreSQL for Data Storage
🚀 Live Demo
Frontend: The Nex Journal
Backend API: https://blog-awpc.onrender.com/api/posts

## 🏗️ Tech Stack
Frontend: React, Tailwind CSS, Axios
Backend: Flask, SQLAlchemy, PostgreSQL
Database: PostgreSQL (Hosted on Render)
Hosting: Render (Backend) + Azure Static Web Apps (Frontend)

## ⚙️ Setup Guide
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/nex-journal.git
cd nex-journal
```

### 2️⃣ Backend Setup
Install Dependencies
```bash
cd server
pip install -r requirements.txt
```

### Set Up Environment Variables
Create a .env file in the server directory:

```ini
DATABASE_URL=your_postgresql_database_url
ADMIN_PIN=your_admin_password
```
Run the Server Locally
```bash
flask run
The backend will be available at http://127.0.0.1:5000.
```

### 3️⃣ Frontend Setup
Install Dependencies
```bash
cd ../frontend
npm install
```
Run the Development Server
```bash
npm run dev
```
The frontend will be available at http://localhost:3000.

## 🔑 Admin Panel
To access the admin panel:

Go to the Admin Panel Login page.

Enter the Admin PIN (loaded fronm env).

Once authenticated, you can:

Create new blog posts.
Edit existing posts.
Delete posts.

## 📖 API Endpoints
🔹 Get All Posts
```http
GET /api/posts
```
#### Response:

```json
[
  {
    "id": 1,
    "title": "First Blog Post",
    "content": "This is the content of the first post...",
    "image_url": "https://blog-awpc.onrender.com/static/uploads/image.jpg",
    "medium_link": "https://medium.com/some-post",
    "date_posted": "2025-02-14"
  }
]
```
🔹 Get Single Post
```http
GET /api/posts/{id}
```
🔹 Create a New Post (Admin Only)
```http
POST /api/posts
```
Payload:

```json
{
  "title": "New Blog Post",
  "content": "This is a new post...",
  "medium_link": "https://medium.com/some-post"
}
```
🔹 Update a Post (Admin Only)
```h
PUT /api/posts/{id}
```
🔹 Delete a Post (Admin Only)
```http
DELETE /api/posts/{id}
```

## 📜 License
MIT License © 2025 The Nex Journal