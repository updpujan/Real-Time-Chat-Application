import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';

import sequelize from './database.js';

const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  store: sessionStore,

  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
