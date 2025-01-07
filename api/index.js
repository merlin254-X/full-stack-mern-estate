import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const mongoUri = process.env.MONGO;
console.log(`Connecting to MongoDB at: ${mongoUri}`);
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// Define Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Cloudinary Upload Endpoint
app.post('/api/upload', async (req, res) => {
  const { images } = req.body;

  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ message: 'Invalid images data' });
  }

  try {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          upload_preset: 'unsigned_upload',
          allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
        });
        return uploadResponse;
      })
    );

    const publicIds = uploadedImages.map((img) => img.public_id);
    return res.status(200).json({ success: true, publicIds });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});