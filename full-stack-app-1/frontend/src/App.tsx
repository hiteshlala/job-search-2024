import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  const status = () => 
    fetch('/api/status')
    .then(r => r.json())
    .then(r => setMessage(JSON.stringify(r)))
    .catch(e => setMessage(e.message || 'error'));

  return (
    <>
      <h1>Rent a Cat</h1>
      <div className="card">
        <p>
          <button onClick={status}>Make Req</button>
        </p>
        <p>{message}</p>
      </div>
    </>
  )
}

export default App
