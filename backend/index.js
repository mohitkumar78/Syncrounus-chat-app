import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectdb from './Db/db.connect.js'
import userrouter from './Router/user.routes.js'
import contactrouter from "./Router/Contact.routes.js"
import messagerouter from "./Router/message.routes.js"
import channelrouter from "./Router/Channel.routes.js"
import scoketSetup from './Scoket.js'
import path from "path"
const app = express();

app.use(cors({
    origin: "https://syncrounus-chat-app-1.onrender.com",

    credentials: true,
},))
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
const port = process.env.PORT
const _dirname = path.resolve()
app.use("/uploads/files", express.static("uploads/files"))
app.use(cookieParser())
app.use("/api/v1/user", userrouter);
app.use("/api/v1/users", contactrouter);
app.use("/api/v1/message", messagerouter);
app.use("/api/v1/channels", channelrouter)
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})
const server = app.listen(port, () => {
    console.log(`app is running on port no${port}`)
    connectdb()
})
scoketSetup(server);

