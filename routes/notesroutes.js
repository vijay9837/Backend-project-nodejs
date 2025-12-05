const express = require("express")
const app = express()
const router = express.Router()
const path = require("path")
const authentication = require("../middleware/auth")
const multer = require("multer")
const notesSchema = require("../model/noteschema")
const userSchema = require("../model/userschema")
const fs = require("fs")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage, fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png)');
    }
}

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/:id/note", authentication, async (req, res) => {
    try {
        const id = req.params.id
        const post = await notesSchema.findOne({
            notesid: id
        })
        const finalpostobj = {
            notesid: post.notesid,
            title: post.title,
            content: post.content,
            owner: post.owner,
            file: post.file
        }

        if (!post) {
            return res.status(401).send("Post Not Found")
        }

        res.status(200).render("singlenote", { post: finalpostobj })
    } catch (error) {
        res.status(500).send("Server Error" + error)
    }
})

router.get('/:id/addnotes', authentication, (req, res) => {
    try {
        const uid = req.params.id
        res.render("addnotes", { uid })
    } catch (error) {
        res.send("error" + error)
    }
})

router.post("/:id/addnotes", authentication, upload.single("image"), async (req, res) => {
    try {
        const uid = req.params.id;
        const data = req.body;
        const file = req.file;
        const user = await userSchema.findOne({
            uid: uid
        })

        const newnotes = new notesSchema({
            notesid: Date.now(),
            title: data.title,
            content: data.content,
            owner: {
                uid: user.uid,
                username: user.username,
                email: user.email,
            },

            file: file.filename
        })

        const save = await newnotes.save()
        if (save) {
            return res.status(200).redirect("/home")
        }
        return res.status(401).send("Something error")
    } catch (error) {
        res.status(500).send("error " + error);
    }
})

router.get("/:id/delete", authentication, async (req, res) => {
    try {
        const id = req.params.id
        const deletepost = await notesSchema.findOneAndDelete({
            notesid: id
        })
        fs.unlinkSync(path.join(__dirname, `../uploads/${deletepost.file}`))
        const isfile = fs.existsSync(path.join(__dirname, `../uploads/${deletepost.file}`))
        if (deletepost && !isfile) {
            return res.status(200).redirect("/home")
        }
        return res.status(401).send("Post Not Delete")
    } catch (error) {
        res.status(500).send("Server Error " + error)
    }
})



module.exports = router