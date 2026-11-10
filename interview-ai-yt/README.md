# AI Interview Platform

An AI-powered interview preparation platform that helps users generate interview reports and create professional, editable resumes based on their resume details, self-description, and target job description.

## Overview

The AI Interview Platform uses Google's Gemini AI to analyze user-provided information and generate structured interview reports and resume content.

Users can preview their generated resumes, edit different sections, save their changes, and download the final resume as a PDF.

## Features

- **AI-Powered Resume Generation:** Generate structured resume content using Google Gemini.
- **Interview Report Generation:** Generate interview-related reports based on the uploaded resume, self-description, and job description.
- **Resume Preview:** Preview generated resume content directly in the application.
- **Editable Resume:** Edit personal details, professional summary, skills, education, projects, experience, and certifications.
- **Save Resume:** Store updated resume information in MongoDB.
- **PDF Generation:** Generate and download a PDF using saved resume data.
- **User Authentication:** Register, log in, and log out securely.
- **Profile Management:** View account information through a dedicated profile page.

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- SCSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini API
- JWT Authentication
- Zod
- Multer
- Puppeteer

## Project Structure

```text
interview-ai-yt/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/omhinge3-dotcom/FullStack-Projects.git
```

Navigate to the project directory:

```bash
cd FullStack-Projects/interview-ai-yt
```

### 2. Backend Setup

Navigate to the Backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables, including your MongoDB connection string, JWT secret, and Gemini API key. Use the exact variable names expected by your backend configuration.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the project directory:

```bash
cd FullStack-Projects/interview-ai-yt/Frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Application Workflow

1. Register or log in to your account.
2. Upload your resume.
3. Enter your self-description and target job description.
4. Generate an AI-powered interview report and resume.
5. Preview the generated resume.
6. Edit the resume sections as required.
7. Save the updated resume.
8. Download the final resume as a PDF.

## Security

- Authentication-protected application routes.
- JWT-based authentication.
- Server-side ownership checks for resume data.
- Environment variables for sensitive credentials.

**Important:** Never commit API keys, database credentials, JWT secrets, or `.env` files to GitHub.

## Future Improvements

- More advanced interview evaluation.
- Additional resume templates.
- Interview performance analytics.
- Support for multiple resume formats.

## Author

**Omkumar Ashok Hinge**

Electronics and Computer Engineering Student

GitHub: [omhinge3-dotcom](https://github.com/omhinge3-dotcom)

---

*Built as a full-stack project to explore AI integration, backend development, authentication, database management, and resume automation.*