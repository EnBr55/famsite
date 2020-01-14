import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import TodoList from './Modules/TodoList/TodoList'
import firebaseRef from './firebase' 
import LoginDropDown from './Components/LoginDropDown/LoginDropDown'
import { UserProvider } from './Contexts/UserContext'

type user = {
  loggedIn: boolean
  id: string
  email: string
  name: string
  boards: string[]
}

const onAuthStateChange = (setUser: (user: user) => void) => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      let name = ''
      let boards = []
      firebaseRef.firestore().collection('users').doc(user.uid)
        .get().then(doc => {
          if (doc && doc.data()) {
            name = doc.data()!.name
            boards = doc.data()!.boards

            setUser({loggedIn: true, id: user.uid, name: name, email: user.email!, boards: boards})
          }
        })

    } else {
      console.log('logged out')
      setUser({loggedIn: false, id: '', email: '', name: '', boards: []})
    }
  })
}

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)
  const [login, setLogin] = React.useState(false)
  const toggleLogin = (): void => setLogin(!login)

  const [user, setUser] = React.useState({ loggedIn: false, id: '', email: '', name: '', boards: ['']})

  const [module, setModule] = React.useState(<TodoList boardId={'oPJb7gIdzFSjU7FQswRS'} moduleId={'KwYx1joUzZbsfESRgh8o'}/>)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser)
    return () => { unsubscribe() }
  }, [])

  return (
    <div className="App">
      <UserProvider value={user}>
        <Navbar toggleSidebar={toggleSidebar} setLogin={toggleLogin}/>
        <Sidebar open={sidebar} toggleSidebar={toggleSidebar} />
        <LoginDropDown open={login} loggedIn={user.loggedIn} toggleLogin={toggleLogin}/>

        AAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAA
        { module }
        <span>aaaa{user.id}</span>
      </UserProvider >
    </div>
  )
}

export default App;
