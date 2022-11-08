import user from "./src/dao/user";
import userToken from "./src/dao/userToken";
import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors"
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";

// user.getUser("hui").then(console.log)
// user.createUser("huiyinggg", "password").then(console.log)

// user.deleteUser("huiyinggg").then(console.log)
// user.updatePassword("huiyinggg", "password123").then(console.log)


const app = express()
const port = 3001
var corsOptions = {
    credentials: true,
    origin: ['http://18.141.230.17:3000', 'http://student-7.sutdacademytools.net:3000']
}
app.use(cors(corsOptions))
app.use(express.json()) // Parse request body as JSON
app.use(bodyParser.urlencoded());
app.use(cookieParser())

const saltRounds = 10;

// login
// using post request because fetch does not allow body in GET requests
// TODO: set cookies for login and create account
app.post('/api/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const userDetails = await user.getUser(username)

    if (userDetails == undefined) {
        res.send({
            "status": 400,
            "message": "user does not exist"
        })
    } else {
        bcrypt.compare(password, userDetails.password, function (err, result) {
            if (result) {
                let randomUuid = uuidv4();
                res.cookie('user-auth', `${randomUuid}`, {
                    maxAge: 9000000,
                    httpOnly: true,
                })
                userToken.insertToken(`${username}`, `${randomUuid}`)
                res.send({
                    "status": 200,
                    "message": "login success"
                })
            }
            else {
                res.send({
                    "status": 400,
                    "message": "incorrect password"
                })
            }
        })
    }
})


// create account
// request body should contain username, password
app.post('/api/newuser', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const insertUser = await user.createUser(username, hash)
            if (insertUser) {
                let randomUuid = uuidv4();
                res.cookie('user-auth', `${randomUuid}`, {
                    maxAge: 9000000,
                    httpOnly: true,
                })
                userToken.insertToken(`${username}`, `${randomUuid}`)
                res.send({
                    "status": "200",
                    "message": "user created"
                })
            } else {
                res.send({
                    "status": "400",
                    "message": "bad request"
                })
            }
        });
    });
})

// update password
app.post('/api/updatepassword', async (req, res) => {
    const username = req.body.username
    const userDetails = await user.getUser(username)
    const oldPassword = req.body['old-password']
    const newPassword = req.body['new-password']
    const retypePassword = req.body['retype-password']
    const userCookieToken = req.cookies['user-auth']
    const storedToken = (await userToken.getToken(username))?.token ?? ""

    if (storedToken == userCookieToken) {
        bcrypt.compare(oldPassword, userDetails?.password ?? "", function (err, result) {
            if (result) {
                if (newPassword == retypePassword) {
                    console.log('new password: ', newPassword)

                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(newPassword, salt, async (err, hash) => {
                            user.updatePassword(username, hash)
                        });
                    })
                    res.status(200).send({ "status": 200, "message": "Password Updated" })
                } else {
                    res.status(404).send({ "status": 404, "message": "Bad Request, New password and Re-type password do not match" })
                }
            }
            else {
                res.status(401).send({ "status": 401, "message": "Unauthorized" })
            }
        })
    } else {
        res.status(403).send({ "status": 403, "message": "Forbidden" })
    }
})

// logout
app.post('/api/logout', (req, res) => {
    const username = req.body.username
    userToken.deleteToken(username)
    res.status(200).send({"status": 200, "message": "logged out"})
})

// delete acc
app.post('/api/deleteaccount', (req, res) => {
    const username = req.body.username
    userToken.deleteToken(username)
    user.deleteUser(username)
    res.status(200).send({"status": 200, "message": "user deleted"})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
