import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import crypto from 'node:crypto';
import Session from '../models/Session';
import User from '../models/User';

const mstimes = {
  min: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
};

const sessionLength = mstimes.week;
export const sessionCookieName = 'rent-a-cat';

export function createCookieOptions(expires: number = Date.now() + sessionLength) {
  return {
    httpOnly: false,
    path: '/',
    overwrite: true,
    signed: false,
    expires: new Date(expires), 
    sameSite: true,
  };
}

export function hashPassword(password: string) {
  const salt = 5897;
  return crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');
}

async function slide(key: string) {
  try {
    const now = Date.now();
    const session = await Session.findOne({
      where: { 
        key,
        expires: { [Op.gt]: now - sessionLength }
      },
    });

    if (session) {
      session.expires = now + sessionLength;
      await session.save();
      return session;
    }
    return;
  }
  catch( error ) {
    console.log( 'Error sliding session', error.message || error );
    return;
  }
}

export async function createSession(userName: string, password: string) {
  try {
    const hashedpassword = hashPassword(password);
    const user = await User.findOne({
      where: { 
        name: userName,
        password: hashedpassword,
      },
    })
    if (user) {
      const key = crypto.randomUUID();
      const now = Date.now();
      const expires = now + sessionLength;
      const session = await Session.create({
        key,
        userId: user.id,
        expires,
      });
      // https://github.com/sequelize/sequelize/issues/1774 annoying
      session.expires = expires;
      return session;
    }
    else {
      return;
    }
  }
  catch(error) {
    console.log( 'Error while creating a user session', error.message || error );
    return;
  }
}

export function endSession(key: string ) {
  return Session.destroy({ where: { key }});
}

// /* chron job
setInterval(() => {
  console.log( 'Clearing expired sessions' );
  Session.destroy({
    where: {
      expires: { [Op.lte]: Date.now() - sessionLength }
    }
  })
  .catch(error => {
    console.log( 'Error deleting expired sessoins', error.message || error );
  });
}, Math.round( sessionLength / 4 ) );
// */

export const sessionMiddleware: RequestHandler = (req, res, next) => {
  const sessionCookie = req.cookies[sessionCookieName];
  if (!sessionCookie) {
    req.session = undefined;
    next();
  } else {
    slide(sessionCookie)
    .then(session => {
      if (session) {
        req.session = session;
        const cookie = createCookieOptions(session.expires);
        res.cookie(sessionCookieName, session.key, cookie);
      }
      else {
        req.session = undefined;
        res.clearCookie(sessionCookieName)
      }
      next();
    })
    .catch(error => {
      console.log( 'Error checking session', error.message || error );
      req.session = undefined;
      next();
    });
  }
};

