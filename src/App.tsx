import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'

import TodoList from './Modules/TodoList/TodoList'

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)

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
    </div>
  )
}

export default App;
