import express from 'express';
import { deleteChatMessage, getchatHistory } from '../controller/chat/chatcontrollert.js';
import { createRoomController, joinRoomController } from '../controller/chat/roomController.js';

const route = express.Router();
//private message
route.get('/chatHistory/:userId', getchatHistory);
route.delete('/deleteMessage/:messId', deleteChatMessage);

//room group message
route.post('/createRoom', createRoomController);
route.post('/joinRoom/:roomId', joinRoomController);

export default route;
