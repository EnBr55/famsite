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
import { User, defaultUser } from './Models/Users'
import { Board, BoardRef } from './Models/Boards'
import Hammer from 'react-hammerjs'

const onAuthStateChange = (setUser: (user: User) => void) => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      firebaseRef.firestore().collection('users').doc(user.uid)
        .get().then(doc => {
          if (doc && doc.data()) {
            setUser({...defaultUser, ...doc.data(), boards: []})
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
  const [board, setBoard] = React.useState<BoardRef | undefined>()

  const [boards, setBoards] = React.useState<Board[]>([])

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

  React.useEffect(() => {
    const unsubscribe = 
      firebaseRef.firestore().collection('boards')
      .where('members', 'array-contains', user.id)
      .onSnapshot(snapshot => {
      const snapshotBoards: Board[] = []
        snapshot.forEach(doc => {
            snapshotBoards.push({
              members: doc.data().members,
              name: doc.data().name,
              id: doc.id,
              dateCreated: doc.data().dateCreated
            })
        })
        setBoards(snapshotBoards)
        setUser({...user, boards: snapshotBoards})
      })
    return unsubscribe
  }, [user.id])

  const moduleSwitch = () => {
    if (board) {
      switch(board.moduleType) {
        case 'todo':
          return <TodoList boardId={board.board} moduleId={board.module} />
        case 'chat':
          return <Chat boardId={board.board} moduleId={board.module} />
        default:
          return <div style={{marginTop: '5px'}}>No module selected</div>
      }
    }
    else {
      return <div>HOME</div>
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
          <div className="header">
            <Navbar setLogin={toggleLogin} setBoard={setBoard}/>
          </div>
          <div className="not-header">
            <Sidebar />
            <LoginDropDown open={login} loggedIn={user.name !== ''} toggleLogin={toggleLogin}/>
            <div className="module-switch">
              { moduleSwitch() }
            </div>
          </div>
        </SidebarProvider>
      </UserProvider >
    </div>
  )
}

export default App;
