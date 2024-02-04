import express from "express";
const router = express.Router();

import { isAdmin, isAuthenticatedUser } from "../middleware/auth.js";

import {
    addUser,
    getUser,
    getAllUsers,
    deleteUser,
} from "../controllers/user.js";

router.post("/", addUser);
router.delete("/deleteUser", isAuthenticatedUser, deleteUser);
router.get("/getUser/:id", isAuthenticatedUser, getUser);
router.get("/", isAdmin, getAllUsers);

export default router;
