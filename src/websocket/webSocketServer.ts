import { Server } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import authenticateWebSocket from './sessionAuth.js';
import { AuthenticatedWebSocket } from './types.js';

export const initilizeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({
    noServer: true,
  });

  server.on('upgrade', async (request, socket, head) => {
    try {
      const userId = await authenticateWebSocket(request);
      wss.handleUpgrade(request, socket, head, (ws) => {
        const authenticatedSocket = ws as AuthenticatedWebSocket;
        authenticatedSocket.userId = Number(userId);
        wss.emit('connection', authenticatedSocket, request);
      });
    } catch (err) {
      socket.write(
        'HTTP/1.1 401 Unauthorized\r\n' + 'Connection: close\r\n' + `Error: ${err}\r\n` + '\r\n',
      );
      socket.destroy();
      console.log('Websocket Authentication Failed:', err);
    }
  });

  wss.on('connection', (socket: AuthenticatedWebSocket, request) => {
    console.log('WebSocket client connected');
    console.log('Authenticated user:', socket.userId);
    console.log('Cookie:', request.headers.cookie);

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
