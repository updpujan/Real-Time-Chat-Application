import session from 'express-session';
export declare const sessionStore: {
    sync(options?: import("sequelize").SyncOptions): Promise<unknown>;
    touch: (sid: string, data: any, callback?: (err: any) => void) => void;
    stopExpiringSessions: () => void;
    get(sid: string, callback: (err: any, session?: session.SessionData | null) => void): void;
    set(sid: string, session: session.SessionData, callback?: (err?: any) => void): void;
    destroy(sid: string, callback?: (err?: any) => void): void;
    regenerate(req: import("express").Request, callback: (err?: any) => any): void;
    load(sid: string, callback: (err: any, session?: session.SessionData) => any): void;
    createSession(req: import("express").Request, session: session.SessionData): session.Session & session.SessionData;
    all?(callback: (err: any, obj?: session.SessionData[] | {
        [sid: string]: session.SessionData;
    } | null) => void): void;
    length?(callback: (err: any, length?: number) => void): void;
    clear?(callback?: (err?: any) => void): void;
    addListener<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    emit<E extends string | symbol>(eventName: string | symbol, ...args: any[]): boolean;
    eventNames(): (string | symbol)[];
    getMaxListeners(): number;
    listenerCount<E extends string | symbol>(eventName: string | symbol, listener?: ((...args: any[]) => void) | undefined): number;
    listeners<E extends string | symbol>(eventName: string | symbol): ((...args: any[]) => void)[];
    off<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    on<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    once<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    prependListener<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    prependOnceListener<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    rawListeners<E extends string | symbol>(eventName: string | symbol): ((...args: any[]) => void)[];
    removeAllListeners<E extends string | symbol>(eventName?: string | symbol | undefined): /*elided*/ any;
    removeListener<E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void): /*elided*/ any;
    setMaxListeners(n: number): /*elided*/ any;
    [EventEmitter.captureRejectionSymbol]?(error: Error, event: string | symbol, ...args: any[]): void;
};
export declare const sessionMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default sessionMiddleware;
//# sourceMappingURL=session.d.ts.map