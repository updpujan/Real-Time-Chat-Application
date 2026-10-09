import type { WebSocket } from 'ws';

export interface WebSocketMessagee {
  type: string;
  data?: unknown;
}

export interface AuthenticatedWebSocket extends WebSocket {
  userId: number;
}

export type WebSocketEventType =
  | 'user_online'
  | 'user_offline'
  | 'chat_message'
  | 'typing'
  | 'join_room'
  | 'leave_room'
  | 'room_joined'
  | 'room_message'
  | 'error'
  | 'private_message'
  | 'private_message_saved';
