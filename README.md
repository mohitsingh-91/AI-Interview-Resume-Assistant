# AI Interview Resume Assistant

## 📌 Overview
An AI-powered full-stack web application that generates personalized interview reports and job-tailored resumes based on a job description and the user's resume or self-description.

## ✨ Features
- 👤 User Registration
- 🔐 User Login & Authentication
- 📄 Resume Upload
- ✍️ Self-Description Input
- 💼 Job Description Input
- 🤖 AI-Powered Interview Report Generation
- 📊 Personalized Interview Analysis
- 📝 AI-Generated Job-Tailored Resume
- 📥 Downloadable Resume PDF
- 🗂️ View Previously Generated Interview Reports

## 🔄 How It Works
1. User signs up and logs in.
2. User submits a job description along with a resume or self-description.
3. The AI analyzes the input and generates a personalized interview report.
4. User views the generated interview report.
5. The application generates a job-tailored resume based on the job description and user's information.
6. User can download the tailored resume as a PDF.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- SCSS

### Backend
- Node.js
- Express.js
- REST API
- Puppeteer (PDF generation)
- JWT Authentication

### Database
- MongoDB

### AI
- Google Gemini API

## 📁 Project Structure
```
GEN_AI_FULLSTACK_PROJECT/
│
├── Backend/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-github-repository-url>
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file and add the required environment variables.

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open another terminal:
```bash
cd Frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

## 🔑 Environment Variables
The backend requires environment variables for configuration.

Create a `Backend/.env` file with the following:
```
PORT=your_port_no
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```


## 🌐 Deployment
- **Frontend** → Vercel
- **Backend** → Render
- **Source Code** → GitHub


## 👨‍💻 Author
Mohit Singh