import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'
import trainRoutes from './routes/trainRoutes.js'
import userRoutes from './routes/userRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'

const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
  };
app.use(cookieParser());
app.use(express.json()); 
app.use(cors(corsOptions));

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(()=>{
    console.log('DB Connected');
})
.catch((e)=>{
    console.log(e.message);
})

app.use('/api/auth', authRoutes);
app.use('/api/train', trainRoutes);
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ticket', ticketRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server connected at ${PORT}`);
})