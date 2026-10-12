import express from 'express';
import { deleteChatMessage, getchatHistory } from '../controller/chat/chatcontrollert.js';

const route = express.Router();

route.get('/chatHistory/:userId', getchatHistory);
route.delete('/deleteMessage/:messId', deleteChatMessage);

export default route;
