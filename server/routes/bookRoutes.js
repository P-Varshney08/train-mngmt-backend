import express from "express";
import { bookTicket, cancelBooking } from "../controllers/book.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.post("/bookTicket", isAuthenticatedUser, bookTicket);
router.get("/cancelTicket/:ticketID", isAuthenticatedUser, cancelBooking);

export default router;
