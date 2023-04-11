import { Router } from "express";
import * as authCtrl from "../controller/auth.controllet";

const router = Router();

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

export default router;
