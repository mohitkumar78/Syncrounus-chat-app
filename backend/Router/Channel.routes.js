import { createChannel, getAllUserChannel, getChannelMessage } from "../Controller/CreateChannel.controller.js"
import authentication from "../Middleware/Authentication.js"
import express from "express"

const router = express.Router()

router.route("/channel").post(authentication, createChannel);
router.route("/getAllUserChannel").post(authentication, getAllUserChannel);
router.route("/getChannelMessage").post(getChannelMessage)
export default router;