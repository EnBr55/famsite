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
}

const onAuthStateChange = (setUser: (user: user) => void) => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in')
      console.log(user)
      setUser({loggedIn: true, id: 'aaa'})
    } else {
      console.log('logged out')
      setUser({loggedIn: false, id: 'aaa'})
    }
  })
}

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)
  const [login, setLogin] = React.useState(false)
  const toggleLogin = (): void => setLogin(!login)

  const [user, setUser] = React.useState({ loggedIn: false, id: 'bbbb' })

  const [module, setModule] = React.useState(<TodoList boardId={'oPJb7gIdzFSjU7FQswRS'} moduleId={'KwYx1joUzZbsfESRgh8o'}/>)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser)
    return () => { unsubscribe() }
  }, [])

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} setLogin={() => setLogin(true)}/>
      <Sidebar open={sidebar} toggleSidebar={() => setSidebar(!sidebar)} />
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
