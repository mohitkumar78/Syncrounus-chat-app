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
const app = express();

app.use(cors())
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use("/uploads/files", express.static("uploads/files"))
app.use(cookieParser())
app.use("/api/v1/user", userrouter);
app.use("/api/v1/users", contactrouter);
app.use("/api/v1/message", messagerouter);
app.use("/api/v1/channels", channelrouter)
const port = process.env.PORT
const server = app.listen(port, () => {
    console.log(`app is running on port no${port}`)
    connectdb()
})
scoketSetup(server);

