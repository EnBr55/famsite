import React from 'react'
import './Profile.css'
import { UserContext } from '../../Contexts/UserContext'
import firebaseRef from '../../firebase'
import LoadingBar from '../LoadingBar/LoadingBar'

const Profile: React.FC = () => {
  const [error, setError] = React.useState('')
  const [uploadedUrl, setUploadedUrl] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const user = React.useContext(UserContext)
  const logout = () => {
    firebaseRef
      .auth()
      .signOut()
      .then(() => {
        alert('Signed out')
      })
  }

  const uploadProfilePic = (profilePic: File) => {
    setError('')
    if (profilePic.size / 1000000 > 2) {
      setError('Your file exceeds 2MB. Please upload a smaller file.\n')
      return
    }
    if (profilePic.type.split('/')[0] !== 'image') {
      setError(
        'Your file was not in a recognised image format. Please upload an image file.',
      )
      return
    }
    const storageRef = firebaseRef.storage().ref()
    const imageRef = storageRef.child('images/' + profilePic.name)
    setLoading(true)
    imageRef.put(profilePic).then((upload) => {
      upload.ref
        .getDownloadURL()
        .then((url) => {
          setUploadedUrl(url)
          setLoading(false)
        })
        .catch((error) => setError(error))
    })
  }

  const updateProfilePicture = (url: string) => {
    firebaseRef
      .firestore()
      .collection('users')
      .doc(user.id)
      .update({
        picURL: url,
      })
      .then((result) => setError('Update profile picture'))
  }

  return (
    <div className="profile">
      <div className="profile-heading">
        <h1>{user.name}</h1>
        <div className="profile-pic">
          {user.picURL !== '' && (
            <img
              src={user.picURL}
              alt="profile pic"
              height="100%"
              width="100%"
            />
          )}
        </div>
      </div>
      <h2>Your Profile</h2>
      <li>Email address: {user.email}</li>
      <li>Account ID: {user.id}</li>
      <br />
      <button onClick={() => logout()}>Logout</button>
      <br />
      <h3>Profile Picture</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files !== null && uploadProfilePic(e.target.files[0])
        }
      />
      <br />
      <span style={{ color: 'red' }}>{error}</span>
      {uploadedUrl !== '' && (
        <>
          <h4>Preview</h4>
          <div className="image-preview">
            <img src={uploadedUrl} width="100%" alt="preview pfp" />
          </div>
          <br />
          <button onClick={() => updateProfilePicture(uploadedUrl)}>
            Updated profile picture. Change visible on refresh.
          </button>
        </>
      )}
      {loading && <LoadingBar />}
    </div>
  )
}

export default Profile
