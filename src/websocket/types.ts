import type { WebSocket } from 'ws';

export interface WebSocketMessagee {
  type: string;
  data?: unknown;
}

export interface AuthenticatedWebSocket extends WebSocket {
  userId: number;
  isAlive?: boolean;
}

export type WebSocketEventType =
  | 'user_online'
  | 'user_offline'
  | 'online_users'
  | 'chat_message'
  | 'typing'
  | 'stop_typing'
  | 'join_room'
  | 'leave_room'
  | 'room_joined'
  | 'room_message'
  | 'error'
  | 'private_message'
  | 'private_message_saved';
