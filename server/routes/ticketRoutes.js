import express from 'express';
import { getTicket } from '../controllers/ticket.js';
import { isAdmin, isAuthenticatedUser } from '../middleware/auth.js';
const router = express.Router();

router.get('/getTicket/:id', isAuthenticatedUser, getTicket);

export default router;
