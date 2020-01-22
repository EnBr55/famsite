import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import TodoList from './Modules/TodoList/TodoList'
import Chat from './Modules/Chat/Chat'
import firebaseRef from './firebase' 
import LoginDropDown from './Components/LoginDropDown/LoginDropDown'
import { UserProvider } from './Contexts/UserContext'
import { SidebarProvider } from './Contexts/SidebarContext'
import Boards from './Components/Boards/Boards'
import { User, defaultUser } from './/Models/Users'

const onAuthStateChange = (setUser: (user: User) => void) => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      firebaseRef.firestore().collection('users').doc(user.uid)
        .get().then(doc => {
          if (doc && doc.data()) {
            setUser({...defaultUser, ...doc.data()})
          }
        })

    } else {
      console.log('logged out')
      setUser(defaultUser)
    }
  })
}

const App: React.FC = () => {
  const [login, setLogin] = React.useState(false)
  const toggleLogin = (): void => setLogin(!login)

  const [user, setUser] = React.useState<User>(defaultUser)
  const [board, setBoard] = React.useState({ board: 'a', moduleType: 'a', module: 'a'})

  type sidebarContextType = {
    sidebar: JSX.Element | undefined
    default: JSX.Element
    setSidebar(sidebarElement: JSX.Element | undefined): void
    }

    const [sidebarContext, setSidebarContext] = React.useState<sidebarContextType>({
      sidebar: undefined,
      default: <Boards setBoard={setBoard} />,
      setSidebar: (sidebarElement: (JSX.Element | undefined)) => setSidebarContext({
        ...sidebarContext,
        sidebar: sidebarElement
      })
    })

  const moduleSwitch = () => {
    switch(board.moduleType) {
      case 'todo':
        return <TodoList boardId={board.board} moduleId={board.module} />
      case 'chat':
        return <Chat boardId={board.board} moduleId={board.module} />
      default:
        return <div style={{marginTop: '5px'}}>No module selected</div>
    }
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser)
    return () => { unsubscribe() }
  }, [])

  return (
    <div className="App">
      <UserProvider value={user}>
        <SidebarProvider value={sidebarContext}>
          <Navbar setLogin={toggleLogin}/>
          <Sidebar />
          <LoginDropDown open={login} loggedIn={user.name !== ''} toggleLogin={toggleLogin}/>
          { moduleSwitch() }
        </SidebarProvider>
      </UserProvider >
    </div>
  )
}

export default App;
