export interface ChatListItem {
  type: 'private' | 'group';
  id: number;
  name: string;
  lastMessageAt: Date | null;
}
