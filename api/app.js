import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';
import newsRoute from './routes/news.route.js';


const app = express();

app.use(cors({ origin: "https://estate-app-client.onrender.com", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // Tăng giới hạn JSON
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/news', newsRoute);

// Bắt đầu server
app.listen(8800, () => {
    console.log('Server is running on http://localhost:8800');
});
