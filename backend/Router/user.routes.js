import express from 'express';
import { register, login, getInfo } from '../Controller/User.controler.js';
import authentication from '../Middleware/Authentication.js';
const router = express.Router();

router.route('/register').post(register)
router.route("/login").post(login)
router.route("/getInfo").post(authentication, getInfo)

export default router