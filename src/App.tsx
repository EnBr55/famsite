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
  const [login, setLogin] = React.useState(false)
  const toggleLogin = (): void => setLogin(!login)

  const [user, setUser] = React.useState({ loggedIn: false, id: '', email: '', name: '', boards: ['']})
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
        return <span>No module selected</span>
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
          <LoginDropDown open={login} loggedIn={user.loggedIn} toggleLogin={toggleLogin}/>
          { moduleSwitch() }
        </SidebarProvider>
      </UserProvider >
    </div>
  )
}

export default App;
