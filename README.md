# Backend-project-nodejs

This is a simple backend web application built with Node.js, Express.js, and MongoDB, with EJS templating and file-upload support.
It supports user signup/login (with hashed passwords), session management + JWT for authentication, and allows users to upload notes with images. Uploaded files are stored on the server and user data in MongoDB.

# project Structure

/               → root  
|– server.js    → main entry point  
|– routes/      → Express route handlers (signup, login, upload, notes, etc.)  
|– model/       → Mongoose schemas (user, notes)  
|– middleware/  → authentication middleware (JWT / session handling)  
|– views/       → EJS templates (signup, login, home, addnotes, etc.)  
|– uploads/     → stored uploaded images  

# How To Run
step 1 :- npm install
step 2 :- install all Dependencies
step 3 :- start the project (npm start)
# Dependencies
bcryptjs
dotenv
ejs
express
express-session
jsonwebtoken
mongoose
multer
nodemon

# .env

PORT :- YOUR PORT
Database_URL :- YOUR DATABASE URL
jwtsecret :- YOUR SECRET

# Google Drive Link
https://drive.google.com/drive/u/0/folders/1N1V7lPqZHB3D7c-BWjs0KrUX0ij5zjaL


