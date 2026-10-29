import express from 'express';
import { deleteChatMessage, getchatHistory } from '../controller/chat/chatcontrollert.js';
import {
  createRoomController,
  joinRoomController,
  leaveRoomController,
  getMyRoom,
} from '../controller/chat/roomController.js';
import { getConversations } from '../controller/chat/conversation.js';

const route = express.Router();
//private message
route.delete('/deleteMessage/:messId', deleteChatMessage);

//room group message
route.post('/createRoom', createRoomController);
route.post('/joinRoom/:roomId', joinRoomController);
route.delete('/leaveRoom/:roomId/member/me', leaveRoomController);
route.get('/allRooms', getMyRoom);
route.get('/conversation/:type/:id', getchatHistory);
route.get('/conversation', getConversations);

export default route;
