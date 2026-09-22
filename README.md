# Live Session Toolkit

A full-stack web application designed to provide a centralized platform for creating, managing, and conducting interactive live sessions. The system supports session management, interactive activities, participant engagement, real-time communication, analytics, resources, and AI-assisted activity generation.

## Features

- **User Authentication** – Secure signup, login, JWT-based authentication, and profile management.
- **Session Management** – Create, update, view, and manage live sessions with unique join codes.
- **Interactive Activities** – Create and manage polls, quizzes, MCQs, and other session activities.
- **Participant Management** – Allow participants to join sessions and track their participation.
- **Real-Time Communication** – WebSocket-based communication for live session events and updates.
- **Live Session Controls** – Support for camera, microphone, and screen-sharing controls.
- **AI Assistant** – AI-powered assistance for session planning and activity generation.
- **AI Activity Generation** – Generate interactive activities based on topic, audience, and activity type.
- **Resources Management** – Add, manage, and organize session resources.
- **Analytics** – Track participants, responses, activities, accuracy, participation, and engagement.
- **RESTful API** – Structured backend APIs for communication between the frontend and backend.
- **Database Integration** – SQLAlchemy-based database architecture with SQLite support.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT Authentication
- WebSockets

### Database
- SQLite
- SQLAlchemy ORM

## App Preview

## Project Structure

```text
Live-Session-Toolkit/
│
├── my-app/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/                # FastAPI backend
    ├── app/
    │   ├── api/
    │   ├── core/
    │   ├── db/
    │   ├── models/
    │   ├── schemas/
    │   └── services/
    ├── alembic/
    ├── tests/
    ├── requirements.txt
    └── .env.example


<img width="778" height="349" alt="5" src="https://github.com/user-attachments/assets/c96aa705-c1d2-439c-ba7f-bece01ba3a2d" />

Installation & Setup
1. Clone the Repository
git clone <your-github-repository-url>
cd Live-Session-Toolkit
2. Frontend Setup
Navigate to the frontend:

cd my-app
Install dependencies:

npm install
Start the development server:

npm run dev
The frontend will run on:

http://localhost:5173
3. Backend Setup
Open a new terminal and navigate to the backend:

cd backend
Create a virtual environment:

python -m venv venv
Activate it on Windows:

.\venv\Scripts\Activate.ps1
Install the required packages:

pip install -r requirements.txt
Create your .env file using .env.example as a reference.

Start the FastAPI server:

uvicorn app.main:app --reload
The backend API will run on:

http://127.0.0.1:8000
API documentation is available at:

http://127.0.0.1:8000/docs
API
The backend provides RESTful endpoints for:

Authentication
Sessions
Activities
Participants
Responses
Resources
Analytics
AI services
Real-time session events are handled through WebSockets.

AI Integration
The project includes an AI service architecture for:

AI-assisted session planning
Interactive activity generation
AI assistant functionality
The current development setup supports a mock AI provider, allowing the application to be developed and tested before connecting an external AI provider.

Real-Time Communication
WebSockets are used to support real-time session events such as:

Participant joining
Participant leaving
Activity events
Session updates
Live interaction events
Media features such as camera, microphone, and screen sharing are handled separately from the backend's WebSocket event system.

Future Enhancements
PostgreSQL production database
Production AI provider integration
WebRTC-based real-time media communication
Advanced analytics and reporting
Notifications and email integration
Production deployment and scalability improvements
Project Status
Development / Internship Project

The project is being developed as a full-stack solution with a React frontend and FastAPI backend, with the architecture designed to support future real-time and AI-powered functionality.

This project is developed for educational and internship purposes.
