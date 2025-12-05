# Backend-project-nodejs

This is a simple backend web application built with Node.js, Express.js, and MongoDB, with EJS templating and file-upload support.
It supports user signup/login (with hashed passwords), session management + JWT for authentication, and allows users to upload notes with images. Uploaded files are stored on the server and user data in MongoDB.

#project Structure

/               → root  
|– server.js    → main entry point  
|– routes/      → Express route handlers (signup, login, upload, notes, etc.)  
|– model/       → Mongoose schemas (user, notes)  
|– middleware/  → authentication middleware (JWT / session handling)  
|– views/       → EJS templates (signup, login, home, addnotes, etc.)  
|– uploads/     → stored uploaded images  



