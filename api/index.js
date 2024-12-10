import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
dotenv.config();

const app = express();

const mongoUri = process.env.MONGO;
console.log(`Connecting to MongoDB at: ${mongoUri}`);

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use( '/api/user', userRouter);