# Lynx CatBot
## Table of Contents
- [Project Description](#project-description)
- [Features](#key-features)
- [System Diagram](#system-diagram)
- [Example](#example-run)
- [Dependencies](#project-dependencies)
- [Quick Start Guide](#quick-start-guide)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
## Project Description

Lynx CatBot is an intelligent web-based chatbot assistant built to support new and prospective students at Rhodes College. It is designed to provide concise, accurate, and approachable answers to questions about academics, student life, housing, and more. Built with a React frontend and Django backend, the chatbot integrates dynamic AI-generated responses with a curated FAQ knowledge base to offer a robust and user-friendly support experience.

### Key Features

- **Interactive Chat Interface** with animated transitions and quick-suggestion buttons.
- **AI-Powered Responses** using Gemini 2.0 Flash for semantic search and natural language generation.
- **Categorical Question Handling** powered by curated datasets for reliable quick answers.
- **Backend Admin Panel** for managing questions and answers.
- **Dockerized Deployment** for local and remote scalability.

### System Diagram

![System Diagram](docs/system_diagram.png) <!-- Replace with your actual image path -->


### Example Run

![Chat Interface Screenshot](docs/example.png) <!-- Replace with your actual screenshot -->
![Admin Panel Screenshot](docs/example_admin.png) <!-- Replace with your actual screenshot -->

---

## Project Dependencies

### ⚙️ Software Libraries

#### Frontend:
- React
- TypeScript
- TailwindCSS
- Axios
- Framer Motion

#### Backend:
- Python 3.10+
- Django
- Django REST Framework
- Google Generative AI SDK (`google-generativeai`)

### ☁️ Runtime Environments
- Docker
- Docker Compose

### 🗄️ Backend Services
- **Database**: PostgreSQL
- **AI Service**: Gemini 2.0 Flash ([Get API key here](https://makersuite.google.com/app/apikey))

---

## Quick Start Guide

### 🛠️ Installation Instructions

Clone the repository:

```bash
git clone https://github.com/Rhodes-CS-comp486/lynx-catbot.git
cd lynx-catbot

```

### Environment Setup

Create a .env file in the project root (same directory as docker-compose.yml): 

```
# Database settings
DB_NAME=catbot
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432

# AI + Django settings
GOOGLE_API_KEY=your_gemini_api_key
DJANGO_SECRET_KEY=your_secret_key

# Frontend API base URL
VITE_API_URL=http://localhost:8000
```

(Login credentials for database can be acquired upon request)

### Docker Container(Recommended)

Host Links

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Make sure your ```.env``` is present in the root before running this command

```
docker-compose up --build
```

###  Manual Setup 

#### Backend Setup
Install required dependecies 
```
cd backend
pip install -r requirements.txt
```
Setup local migrations
```
python manage.py migrate
```
Run server for client connection

```
python manage.py runserver
```
#### Frontend Setup
Install required node modules
```
cd frontend
npm install
npm fund - if dependecies are not funded automatically)
```
Run client instance

```
npm run dev
```


### API Documentation

For more detailed API documentation:

- Visit: http://localhost:8000/swagger/


## Contributors
<!-- | Name           | GitHub Profile                                         | Contributions (%) |
|----------------|--------------------------------------------------------|-------------------|
| Eddie Puebla   | [@EddiePueb1](https://github.com/EddiePueb1)           | 68.1%             |
| Harper Kole    | [@harperkole](https://github.com/harperkole)           | 24.1%             |
| JD Willis      | [@JD-Willis1](https://github.com/JD-Willis1)           | 7.8%              | -->

See [Contributor Graph](https://github.com/Rhodes-CS-comp486/lynx-catbot/graphs/contributors) for live commit history.

![GitHub contributors](https://img.shields.io/github/contributors/Rhodes-CS-comp486/lynx-catbot?style=flat-square)

