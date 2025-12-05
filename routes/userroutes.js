require("dotenv").config()
const express = require("express")
const router = express.Router()
const session = require("express-session")
const bcrypt = require("bcryptjs")
const userSchema = require("../model/userschema")
const noteSchema = require("../model/noteschema")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const authentication = require("../middleware/auth")


router.use(cookieParser())
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.Database_URL).then(() => {
    console.log("Mongo db Connect")
}).catch((error) => {
    console.log(error)
})


router.use(session({
    resave: false,
    secret: "vijay kumar"
}))



router.get("/", (req, res) => {
    res.redirect("/signup")
})

router.get("/signup", (req, res) => {
    res.status(200).render("signup")
})

router.get("/home", authentication, async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login')
        }
        const user = req.session.user
        const posts = await noteSchema.find({
            "owner.uid": user.uid
        })
        if (posts.length <= 0) {
            return res.render('home', { user, posts: "no posts" })
        }
        let finalarrayposts = []
        if (posts.length > 0) {
            for (let post of posts) {
                const postobj = {
                    notesid: post.notesid,
                    title: post.title,
                    content: post.content,
                    owner: post.owner,
                    file: post.file
                }

                finalarrayposts.push(postobj)
            }
        }

        res.render('home', { user, posts: finalarrayposts })

    } catch (error) {
        res.send("Unauthorized")
    }
})

router.post("/signup", async (req, res) => {
    const data = req.body
    try {
        const isemail = await userSchema.find({
            email: data.email
        })
        const isusername = await userSchema.find({
            username: data.username
        })
        if (isemail.length > 0) {
            res.status(200).render("signup", { emailerror: "Email is already Registered" })
        } else if (isusername.length > 0) {
            res.status(200).render("signup", { usernameerror: "username is already Registered" })
        } else {
            const hashedpasword = await bcrypt.hash(data.password, 10)
            const newuser = new userSchema({
                uid: Date.now(),
                username: data.username,
                email: data.email,
                password: hashedpasword
            })
            const save = newuser.save()
            if (save) {
                res.status(200).send("User Registered")
            } else {
                res.status(200).send("User not register...")
            }
        }
    } catch (error) {
        res.status(500).send("Server Error")
    }
})

router.get("/login", (req, res) => {
    res.status(200).render("login")
})

router.post("/login", async (req, res) => {
    const data = req.body
    try {
        const user = await userSchema.findOne({
            email: data.email,
        })
        if (!user) {
            res.status(200).render("login", { emailerror: "Email not registered" })
        } else {
            const passwordMatch = await bcrypt.compare(data.password, user.password);
            if (user && passwordMatch) {
                const token = jwt.sign({ email: user.email }, process.env.jwtsecret, { expiresIn: "1h" });
                res.cookie('token', token, {
                    httpOnly: true
                })
                req.session.user = user
                res.status(200).redirect('/home')
            } else {
                res.status(200).render("login", { passworderror: "Password Not Correct" })
            }
        }
    } catch (error) {
        res.status(500).send("Server Error" + error)
    }
})

router.get("/logout", (req, res) => {
    try {
        const uid = req.params.id
        req.session.destroy()
        res.redirect("/login")
    } catch (error) {
        res.send("error" + error)
    }
})


module.exports = router