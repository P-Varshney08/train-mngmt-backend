import express from "express";
import { getAllUsers } from "../controllers/admin.js";
import { isAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get('/users', isAdmin, getAllUsers);

export default router;