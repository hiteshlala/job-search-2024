import express from 'express';
import { 
  endSession,
  sessionCookieName,
  createSession,
  createCookieOptions,
} from '../middleware/setSession';

export const login = express.Router();

login.post('/login', (req, res) => {
  const { userName, password } = req.body;
  createSession(userName, password)
  .then(session => {
    console.log(userName, password, session);
    if (session) {
      req.session = session;
      const cookie = createCookieOptions(parseInt(session.expires));
      res.cookie(sessionCookieName, session.key, cookie);
      res.send({
        message: 'Logged in successfully',
        loggedIn: true,
        key: session.key,
      });
    } else {
      res.send({
        message: 'Invalid username or password',
        loggedIn: false,
      })
    }
  })
  .catch(error => {
    res.send({
      message: `Error logging in', ${error.message || error }`,
      loggedIn: false,
    });
  });
});

login.delete('/login', (req, res) => {
  if (req.session) {
    endSession(req.session.key)
    .then(() => {
      res.clearCookie(sessionCookieName)
      res.send({
        loggedOut: true,
      });
    })
    .catch(error => {
      console.log( 'Error logging out', error.message);
      res.send({
        loggedOut: false,
        error: `Error logging out ${error.message}`,
      });
    })
  } else {
    res.clearCookie(sessionCookieName)
    res.send({
      loggedOut: true,
    });
  }
});
