import type { WebSocket } from 'ws';

export interface WebSocketMessagee {
  type: string;
  data?: unknown;
}

export interface AuthenticatedWebSocket extends WebSocket {
  userId: number;
}
