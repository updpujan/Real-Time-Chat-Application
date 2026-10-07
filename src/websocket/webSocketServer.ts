import { WebSocketServer } from 'ws';
import { Server } from 'node:http';

export const initilizeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({
    server,
  });

  wss.on('connection', (socket) => {
    console.log('WebSocket client connected');

    socket.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
          case 'chat_message':
            console.log('chat message:', parsedMessage.data);
            wss.clients.forEach((client) => {
              if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: 'chat_message',
                    data: parsedMessage.data,
                  }),
                );
              }
            });
            break;
          case 'typing':
            console.log('User is typing');
            break;
          default:
            console.log('unknow type');
        }
      } catch (error) {
        console.error('Invalid Websocket Message', error);
      }
    });
    socket.on('close', () => {
      console.log('Webscoket client disconnected');
    });
  });
  return wss;
};
