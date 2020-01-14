import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import TodoList from './Modules/TodoList/TodoList'
import firebaseRef from './firebase' 

const onAuthStateChange = () => {
  return firebaseRef.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in')
      console.log(user)
    } else {
      console.log('logged out')
    }
  })
}

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)
  const [user, setUser] = React.useState({ loggedIn: false, id: 'bbbb' })

  const [module, setModule] = React.useState(<TodoList boardId={'oPJb7gIdzFSjU7FQswRS'} moduleId={'KwYx1joUzZbsfESRgh8o'}/>)
  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebar} />

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
