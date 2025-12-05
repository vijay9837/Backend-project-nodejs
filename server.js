require("dotenv").config()
const express = require("express")
const app = express()
const session = require("express-session")
const port = process.env.PORT
const path = require("path")


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userroutes = require("./routes/userroutes")
const notesroutes = require("./routes/notesroutes")
app.use(session({
    resave: false,
    secret: "vijay kumar",
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use("/", userroutes)
app.use("/notes",notesroutes)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})