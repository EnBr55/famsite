import React from 'react'
import './Profile.css'
import { UserContext } from '../../Contexts/UserContext'
import firebaseRef from '../../firebase'

const Profile: React.FC = () => {
  const user = React.useContext(UserContext)
  const logout = () => {
    firebaseRef.auth().signOut().then(() => {
      alert('Signed out')
    })
  }

  return (
    <div className='profile'>
      <h1>{user.name}</h1>
      <h2>Your Profile</h2>
      <li>Email address: {user.email}</li>
      <li>Account ID: {user.id}</li>
      <br />
      <button onClick={() => logout()}>Logout</button>
      
    </div>
  )
}

export default Profile
