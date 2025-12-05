require("dotenv").config()
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).redirect("/login")
    }
    try {
        const decoded = jwt.verify(token, process.env.jwtsecret)
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).redirect("/login");
    }
};

module.exports = authentication;
