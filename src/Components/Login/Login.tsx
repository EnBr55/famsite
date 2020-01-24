import React from 'react'
import firebaseRef from '../../firebase'
import LoadingBar from '../LoadingBar/LoadingBar'

const Login: React.FC<{open: boolean}> = ({ open }) => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [registering, setRegistering] = React.useState(false)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const submitLogin = () => {
    setLoading(true)
    firebaseRef.auth().signInWithEmailAndPassword(email, password)
      .then(() => setLoading(false))
      .catch(error => {
        setLoading(false)
        setError(error.message)
      })
    setPassword('')
  }

  const signup = (emailRef: string, passwordRef: string, nameRef: string, usernameRef: string) => {
    setLoading(true)
    firebaseRef.firestore().collection('users').get().then(users => {
      let failed = false
      users.forEach(user => {
        if (user.data().usernameLower === usernameRef.toLowerCase()) {
          failed = true
          setError('Username already taken. Please pick another username.')
          setLoading(false)
        }
      })
      if (!failed) {
        firebaseRef.auth().createUserWithEmailAndPassword(emailRef, passwordRef)
          .then(newUser => {
            if (newUser.user) {
              firebaseRef
                .firestore()
                .collection('users')
                .doc(newUser.user.uid)
                .set({
                  name: nameRef,
                  nameLower: nameRef.toLowerCase(),
                  username: usernameRef,
                  usernameLower: usernameRef.toLowerCase(),
                  email: emailRef,
                  id: newUser.user.uid,
                  boards: [],
                  picURL: 'https://firebasestorage.googleapis.com/v0/b/famsites.appspot.com/o/images%2Fdefault_profile.png?alt=media&token=882fd694-a580-4d68-b1bb-9cec4db1c0bd',
                })
            }
            setLoading(false)
          })
          .catch(error => setError(error.message))
      }
    })
  }

  if (registering && !open) { setRegistering(false) }

  return (
    <div className="login">

      <div className="name" style={{ 
        opacity: registering ? '1' : '0',
        transition: 'opacity 0.5s ease 0.5s'
      }}>
        Name: <br />
        <input onChange={e => setName(e.target.value)}/> <br />
        <br />
        Username: <br />
        <input onChange={e => setUsername(e.target.value)}/> <br />
        <br />
      </div>

      <div style={{
        transform: registering ? 'translateY(0)' : 'translateY(-4em)',
        transition: 'transform 0.8s ease'
      }}>
        Email: <br />
        <input onChange={e => setEmail(e.target.value)}/> <br />
        <br />
        Password: <br />
        <input onChange={e => setPassword(e.target.value)} type="password"/> <br />
        <br />
        {!registering && <button onClick={() => submitLogin()}> Login </button>}
        {!registering && <button onClick={() => setRegistering(true)}> Register </button>}
        {registering && <> 
          <button onClick={() => {
          if (!name) { setError('Please enter a name') }
          else { signup(email, password, name, username) }
        }}> 
          Create Account
        </button>
        <button onClick={() => setRegistering(false)}>Cancel</button>
        </>}
        { loading && <div className="loading-bar">
          <LoadingBar />
        </div> }
      </div>
      <span style={{color: 'red'}}>{error}</span>

    </div>
  )
}

export default Login
