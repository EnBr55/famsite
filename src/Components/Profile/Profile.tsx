import React from 'react'
import './Profile.css'
import { UserContext } from '../../Contexts/UserContext'
import firebaseRef from '../../firebase'
import Notifications from '../Notifications/Notifications'
import FullscreenModal from '../FullscreenModal/FullscreenModal'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LoadingBar from '../LoadingBar/LoadingBar'

const Profile: React.FC = () => {
  const [error, setError] = React.useState('')
  const [uploadedUrl, setUploadedUrl] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [file, setFile] = React.useState<File>()
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
    const imageRef = storageRef.child('images/' + 'userProfilePics/' + user.id)
    setLoading(true)
    imageRef.put(profilePic).then((upload) => {
      upload.ref
        .getDownloadURL()
        .then((url) => updateProfilePicture(url))
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
      .then((result) => {
        setUploadedUrl(url)
        setFile(undefined)
        setLoading(false)
      })
  }

  const userInfo = () => <div className="profile-info">
    <div><i>name</i><br/>{user.name}</div>
    <div><i>username</i><br/>{user.username}</div>
    <div><i>email</i><br/>{user.email}</div>
    <div><button onClick={() => logout()}>Logout</button></div>
  </div>

console.log(user.picURL)
  const profilePicInfo = () => <div>
    <label htmlFor="file">
      <div className="profile-pic">
        {loading && <LoadingBar />}
        {(!loading && user.picURL !== '') && ( <>
          <AddAPhotoIcon className="upload-pic-icon"/>
          <img
            src={(file && URL.createObjectURL(file)) || uploadedUrl || user.picURL}
            alt="profile pic"
            height="100%"
            width="100%"
          />
        </>)}
      </div>
    </label>
    <input
      className="image-upload"
      type="file"
      id="file"
      accept="image/*"
      onChange={(e) =>
        e.target.files !== null && setFile(e.target.files[0])
      }
    />
    <br />
    <div style={{ color: 'red' }}>{error}</div>
    {file && <button onClick={() => uploadProfilePic(file)}>Upload</button>}
  </div>

  return (
    <div className="profile">
      <div className="profile-heading">
        <h1>{user.name}</h1>
        {profilePicInfo()}
      </div>
      <br />
      {userInfo()}
      <br />
      <Notifications />
    </div>
  )
}

export default Profile
