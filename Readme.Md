# 🚀 Kuberns Full Stack Assessment

A full-stack web app that allows users to **create and deploy applications to AWS EC2** using a multi-step form interface.

---

## 📚 Project Overview

This project replicates a minimal version of a Heroku-like PaaS. Users can:

- Create a new app
- Define environment variables
- Choose a region, framework, and plan
- Provision EC2 instances via AWS
- Track deployment status and logs

---

## 🧱 Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React, MUI, Axios           |
| Backend   | Django, Django REST Framework |
| Cloud     | AWS EC2 (via Boto3)         |
| DB        | SQLite (dev)                |

---

## ✨ Features

### 🖥️ Frontend
- Multi-step app creation form
- MUI-based responsive UI
- Axios integration with backend
- Display EC2 instance info and deployment logs

### ⚙️ Backend
- RESTful APIs using Django + DRF
- Models: `WebApp`, `Environment`, `EnvVariable`, `Instance`, `DeploymentLog`
- AWS EC2 provisioning via `boto3`
- Logs for deployment events
- Error handling and validation

---

## 🏗️ Project Structure

### 📁 Frontend (React)
```

kuberns-frontend/
├── src/
│   ├── components/
│   │   └── CreateApp/
│   │       ├── Step1.js
│   │       ├── Step2.js
│   │       └── index.js
│   ├── App.js
│   └── theme.js

```

### 📁 Backend (Django)
```

kuberns\_backend/
├── webapps/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── kuberns\_backend/
│   └── settings.py

````

---

## 🛠️ Setup Instructions

### 🔹 Prerequisites
- Python 3.11+
- Node.js 18+
- AWS credentials (with EC2 access)

---

### 🔸 Backend Setup

```bash
git clone https://github.com/Amankumaraman/kuberns.git
cd kuberns-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

> 🔐 Set your AWS keys in `.env` or directly in Django `settings.py`:

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=your_region
```

---

### 🔸 Frontend Setup

```bash
cd kuberns-frontend
npm install
npm start
```

> 📌 Ensure the backend is running at `http://127.0.0.1:8000`.

---

## 🚀 How It Works

1. Fill out Step 1: App Name, Region, Plan, Framework
2. Fill out Step 2: Add environment variables
3. On submit:

   * App is saved in DB
   * EC2 instance is provisioned via AWS
   * Deployment log is created
4. Instance and logs are returned and displayed in UI


## 🧪 Testing

Use Postman or your frontend to send:

```json
POST /api/webapps/
{
  "user_id": 1,
  "name": "my-app",
  "region": "us-east-1",
  "framework": "Django",
  "plan": "starter",
  "environment": {
    "name": "production",
    "variables": [
      { "key": "DEBUG", "value": "false" },
      { "key": "SECRET_KEY", "value": "abc123" }
    ]
  }
}
```

---

## 🧑‍💻 Author

* **Aman Kumar**
* GitHub: [@Amankumaraman](https://github.com/Amankumaraman)

---
