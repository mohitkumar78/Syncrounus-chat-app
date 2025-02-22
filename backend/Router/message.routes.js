import express from "express"
import { getAllmessage, uploadFile } from "../Controller/Messages.controller.js"
import authentication from "../Middleware/Authentication.js"
import multer from 'multer'
const Router = express.Router()
const upload = multer({ dest: "uploads/files" })
Router.route("/getAllmessage").post(authentication, getAllmessage);
Router.route("/upload-file").post(authentication, upload.single("file"), uploadFile)
export default Router;