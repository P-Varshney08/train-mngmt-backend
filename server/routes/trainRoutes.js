import express from 'express';
const router = express.Router();
import { addTrain, getTrain, getTrains, deleteTrain } from '../controllers/train.js'
import { isAdmin } from '../middleware/auth.js';
 
router.post('/addTrain', isAdmin, addTrain);
router.get('/getTrains', getTrains);
router.get('/getTrain/:id', getTrain);
router.delete('/deleteTrain/:id', isAdmin, deleteTrain);

export default router;