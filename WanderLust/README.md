# WanderLust – Full Stack Travel Listing Platform

WanderLust is a full-stack web application where users can explore travel destinations, create their own listings, upload property images, and share their experiences through reviews.

🌐 **Live Demo:** https://fullstack-projects-1-nvop.onrender.com

## Features

- **User Authentication:** User registration, login, and logout using Passport.js.
- **Listing Management:** Create, view, edit, and delete travel listings.
- **Image Uploads:** Upload and manage listing images using Cloudinary.
- **Reviews & Ratings:** Add and manage reviews for listings.
- **Search Functionality:** Search listings by title, location, country, and description.
- **Category Filters:** Explore listings using categories such as beaches, mountains, forests, deserts, camping, and more.
- **Interactive Maps:** Display listing locations using Mapbox.
- **Session Management:** Maintain user sessions using Express Session and MongoDB.
- **Responsive UI:** User-friendly interface for exploring listings.

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- EJS
- Bootstrap

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js

**Other Tools & Services**
- Cloudinary – Image storage and management
- Mapbox – Interactive maps
- Joi – Server-side data validation
- Git & GitHub – Version control
- Render – Deployment

## Project Structure

```text
WanderLust/
│
├── controllers/
├── init/
├── models/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── scripts/
├── utils/
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
│
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── package-lock.json
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/omhinge3-dotcom/FullStack-Projects.git
```

### 2. Navigate to the Project

```bash
cd FullStack-Projects/WanderLust
```

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Configure Environment Variables

Create a `.env` file inside the `WanderLust` directory and configure the environment variables required by the application.

Typical configuration includes:

```env
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

Also configure your Cloudinary and Mapbox credentials using the exact environment variable names referenced in `cloudConfig.js` and the application code.

**Important:** Never upload your `.env` file or expose API secrets publicly.

### 5. Start the Application

```bash
node app.js
```

Open your browser:

```text
http://localhost:8080
```

## Deployment

The application is deployed on **Render**.

- Hosting: Render
- Database: MongoDB Atlas
- Image Storage: Cloudinary

**Live Website:** https://fullstack-projects-1-nvop.onrender.com

## Future Improvements

- Advanced search and filtering
- Improved user experience
- Additional booking-related functionality
- Enhanced security and performance

## Author

**Omkumar Ashok Hinge**

Electronics and Computer Engineering Student

GitHub: [omhinge3-dotcom](https://github.com/omhinge3-dotcom)

---

If you find this project useful, feel free to explore the repository and share your feedback.
