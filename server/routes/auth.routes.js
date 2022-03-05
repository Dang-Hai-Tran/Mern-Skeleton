// /auth/signin: POST request to create new user with their email and password
// /auth/signout: GET request to clear cookie containing a JWT that was set on the response object apter signin

import express from "express";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router.route("/auth/signin")
    .post(authCtrl.signin);
router.route("/auth/signout")
    .get(authCtrl.signout);

export default router;
