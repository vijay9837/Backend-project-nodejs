const mongoose = require("mongoose")

const ownerschema = new mongoose.Schema({
    uid:String,
    username:String,
    email:String
})

const notesSchema = mongoose.Schema({
    notesid: String,
    title: String,
    content: String,
    owner: ownerschema,
    file: String
})

module.exports = mongoose.model("notes",notesSchema)
