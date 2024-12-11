import { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/icon.png';
import { Login } from './Login';
import { Creating } from './Creating';
import { User } from './types';
import { Landing } from './Landing';

function App() {
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState('');
  const [creating, setCreating] = useState(false);
  const [user, setUser] = useState<User>()

  useEffect(() => {
    console.log(document.cookie);
    document.cookie.split(';').map(cookie => {
      const [key, val] = cookie.split('=');
      if ( /rent-a-cat/.test(key) ) {
        setLoggedIn(val);
      } else {
        setLoggedIn('');
      }
    });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetch(
        '/api/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
          },
        }
      )
      .then(r => r.json())
      .then(r => {
        setUser(r.user);
      })
      .catch(e => setMessage(e.message || 'error'));
    }
  }, [loggedIn]);

  const logout = () => 
    fetch(
      '/api/login',
      {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        },
      }
    )
    .then(r => r.json())
    .then(r => {
      if (!r.loggedIn) {
        setLoggedIn('');
        setMessage('');
        setUser(undefined);
      }
    })
    .catch(e => setMessage(e.message || 'error'));
  
  const logIn = (userName: string, password: string) => 
    fetch(
      '/api/login',
      {
        method: 'POST',
        body: JSON.stringify({ userName, password }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        },
      }
    )
    .then(r => r.json())
    .then(r => {
      setLoggedIn(r.key);
      if (!r.loggedIn) {
        setMessage(r.message);
      } else {
        setMessage('');
      }
    })
    .catch(e => setMessage(e.message || 'error'));

  return (
    <>
      <header className='header'>
        <div><img className='logo' src={logo} /></div>
        <div>Rent a Cat</div>
        <div className='stretch'></div>
        {loggedIn && <div><button onClick={logout}>Logout</button></div>}
      </header>
      <div className="">
        {!loggedIn && !creating && <Login login={logIn} />}
        {!loggedIn && !creating && (
          <div className='message' onClick={() => setCreating(true)}>
            Click here to create a new account.
          </div>
        )}
        {creating && <Creating success={() => setCreating(false)} />}
        {!!message && (
          <div className='message'>
            <div>{message}</div>
          </div>
        )}
        <Landing user={user} />
      </div>
    </>
  )
}

export default App
