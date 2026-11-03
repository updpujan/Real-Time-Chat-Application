import User from '../../models/users.js';
interface SearchChatOptions {
    currentUserId: number;
    query: string;
}
export declare const searchChat: ({ currentUserId, query }: SearchChatOptions) => Promise<{
    people: User[];
    groups: {
        id: number;
        name: string;
        memberCount: number;
        maxMembers: number;
        isFull: boolean;
        isMember: boolean;
    }[];
}>;
export {};
//# sourceMappingURL=searchConversation.d.ts.map