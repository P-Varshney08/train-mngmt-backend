import express from 'express';
const router = express.Router();
import { signin, signup, logout } from '../controllers/auth.js'
 
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/logout', logout);

export default router;