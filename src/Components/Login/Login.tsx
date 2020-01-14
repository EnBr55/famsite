import React from 'react'
import firebaseRef from '../../firebase'

const Login: React.FC<{open: boolean}> = ({ open }) => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [registering, setRegistering] = React.useState(false)
  const [error, setError] = React.useState('')

  const submitLogin = () => {
    firebaseRef.auth().signInWithEmailAndPassword(email, password)
      .catch(error => setError(error.message))
    setPassword('')
  }

  const signup = () => {
    firebaseRef.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => setError(error.message))
  }

  if (registering && !open) { setRegistering(false) }

  return (
    <div className="login">

      <div className="name" style={{ 
        opacity: registering ? '1' : '0',
        transition: 'opacity 1s ease 0.5s'
      }}>Name: <br />
        <input onChange={e => setEmail(e.target.value)}/> <br />
        <br />
      </div>

      <div style={{
        transform: registering ? 'translateY(0)' : 'translateY(-4em)',
        transition: 'transform 0.5s ease'
      }}>
        Email: <br />
        <input onChange={e => setEmail(e.target.value)}/> <br />
        <br />
        Password: <br />
        <input onChange={e => setPassword(e.target.value)} type="password"/> <br />
        <br />
        {!registering && <button onClick={() => submitLogin()}> Login </button>}
        {!registering && <button onClick={() => setRegistering(true)}> Register </button>}
        {registering && <button onClick={() => signup()}> Create Account </button>}
      </div>
      <span style={{color: 'red'}}>{error}</span>

    </div>
  )
}

export default Login
