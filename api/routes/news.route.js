import express from 'express';
import {verifyToken} from '../middleware/verifyToken.js';
import { getNewss, getNews, addNews, updateNews, deleteNews, incrementViews } from '../controllers/news.controller.js';

const router = express.Router();

router.get('/', getNewss);
router.get('/:id', getNews);
router.post('/',verifyToken, addNews);
router.put('/:id',verifyToken, updateNews);
router.delete('/:id', deleteNews);
router.put('/incrementViews/:id', incrementViews);


export default router;