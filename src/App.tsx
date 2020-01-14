import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import TodoList from './Modules/TodoList/TodoList'
import firebaseRef from './firebase' 
import LoginDropDown from './Components/LoginDropDown/LoginDropDown'

type user = {
  loggedIn: boolean
  id: string
  email: string
  name: string
}

const onAuthStateChange = (setUser: (user: user) => void) => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in')
      console.log(user.email)
      let name = ''
      firebaseRef.firestore().collection('users').doc(user.uid)
        .get().then(doc => {
          name=doc.data()!.name
          setUser({loggedIn: true, id: user.uid, name: name, email: user.email!})
        })

    } else {
      console.log('logged out')
      setUser({loggedIn: false, id: '', email: '', name: ''})
    }
  })
}

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)
  const [login, setLogin] = React.useState(false)
  const toggleLogin = (): void => setLogin(!login)

  const [user, setUser] = React.useState({ loggedIn: false, id: '', email: '', name: '' })

  const [module, setModule] = React.useState(<TodoList boardId={'oPJb7gIdzFSjU7FQswRS'} moduleId={'KwYx1joUzZbsfESRgh8o'}/>)

  console.log(user)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser)
    return () => { unsubscribe() }
  }, [])

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} setLogin={toggleLogin}/>
      <Sidebar open={sidebar} toggleSidebar={toggleSidebar} />
      <LoginDropDown open={login} loggedIn={user.loggedIn} toggleLogin={toggleLogin}/>

      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
      { module }
      <span>aaaa{user.id}</span>
    </div>
  )
}

export default App;
