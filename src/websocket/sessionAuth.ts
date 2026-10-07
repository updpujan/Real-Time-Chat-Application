import type { IncomingMessage } from 'node:http';
import * as cookie from 'cookie';
import signature from 'cookie-signature';
import { sessionStore } from '../config/session.js';

const getSessionCookie = (request: IncomingMessage): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      return reject(new Error('Empty cookie header'));
    }

    const cookies = cookie.parseCookie(cookieHeader);

    const sessionCookie = cookies['connect.sid'];

    if (!sessionCookie) {
      return reject(new Error('Missing session cookie'));
    }

    if (!sessionCookie.startsWith('s:')) {
      return reject(new Error('Invalid session cookie'));
    }

    const signedValue = sessionCookie.slice(2);

    const sessionId = signature.unsign(signedValue, process.env.SESSION_SECRET!);

    if (sessionId === false) {
      return reject(new Error('Signature verification failed'));
    }

    sessionStore.get(sessionId, (error, session) => {
      if (error) {
        return reject(error);
      }

      if (!session) {
        return reject(new Error('Session not found'));
      }

      if (!session.userId) {
        return reject(new Error('No user ID found in session'));
      }

      resolve(session.userId);
    });
  });
};

export default getSessionCookie;
