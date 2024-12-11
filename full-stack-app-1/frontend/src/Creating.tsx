import { type ChangeEvent, useState } from "react";

type Props = {
  success: () => void;
}

export const Creating = ({ success }: Props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const updateName = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const updatePswd = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const create = () => 
    fetch(
      '/api/user',
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
      if (r.success) {
        success();
      } else {
        setMessage(r.message);
      }
    })
    .catch(e => setMessage(e.message || 'error'));

  return (
    <>
      <div className="login-box">
        <div className="login-input-wrap">
          <input className="login-input" type="text" value={userName} placeholder="Username" onChange={updateName}/>
        </div>
        <div className="login-input-wrap">
          <input className="login-input" type="password" value={password} placeholder="Password" onChange={updatePswd}/>
        </div>
        <div>
          <button onClick={create}>Create</button>
        </div>
      </div>
      {!!message && (
        <div className='message'>
          <div>{message}</div>
        </div>
      )}
    </>
  );
};