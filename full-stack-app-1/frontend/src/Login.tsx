import { type ChangeEvent, useState } from "react";

type Props = {
  login: (userName: string, password: string) => void;
}

export const Login = ({ login }: Props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const updateName = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const updatePswd = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const doLogin = () => {
    login(userName, password);
  };

  return (
    <div className="login-box">
      <div className="login-input-wrap">
        <input className="login-input" type="text" value={userName} placeholder="Username" onChange={updateName}/>
      </div>
      <div className="login-input-wrap">
        <input className="login-input" type="password" value={password} placeholder="Password" onChange={updatePswd}/>
      </div>
      <div>
        <button onClick={doLogin}>Login</button>
      </div>
    </div>
  );
};